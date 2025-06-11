const path = require('path');
const fs = require('fs');

const addProject = (req, res, next) => {
    const { projectName, projectDesc, linkToGithub, selectedTechnologies } = req.body;
    const studentId = req.user.id;

    if (
        !projectName ||
        !projectDesc ||
        !studentId ||
        !selectedTechnologies ||
        !Array.isArray(selectedTechnologies) ||
        selectedTechnologies.length === 0 ||
        selectedTechnologies.some(tech => !tech.id)
    ) {
        return res.status(400).json({ message: "חסרים פרטי פרויקט, טכנולוגיות או זיהוי משתמש" });
    }

    if (linkToGithub && !/^https:\/\/github\.com\/.+$/.test(linkToGithub)) {
        return res.status(400).json({ message: "נא להזין קישור תקין ל-GitHub" });
    }

    const queryCheckDuplicate = `SELECT id FROM projects WHERE title = ?`;
    db_pool.query(queryCheckDuplicate, [projectName], (err, results) => {
        if (err) {
            console.error("DB Error (check duplicate):", err);
            return res.status(500).json({ message: "שגיאה בבדיקת שם הפרויקט" });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: "כבר קיים פרויקט בשם זה. אנא בחר שם אחר." });
        }

        const queryProject = `INSERT INTO projects (title, description, student_id1, link_to_github) VALUES (?, ?, ?, ?)`;
        db_pool.query(queryProject, [projectName, projectDesc, studentId, linkToGithub || null], (err, result) => {
            if (err) {
                console.error("DB Error (projects):", err);
                return res.status(500).json({ message: "שגיאה בהוספת הפרויקט" });
            }

            const projectId = result.insertId;

            const queryUpdateStudent = `UPDATE students SET project_id = ? WHERE id = ?`;
            db_pool.query(queryUpdateStudent, [projectId, studentId], (err2) => {
                if (err2) {
                    console.error("DB Error (students update):", err2);
                    return res.status(500).json({ message: "שגיאה בעדכון הסטודנט" });
                }

                const technologyPromises = selectedTechnologies.map(({ id }) => {
                    const queryTechnology = `INSERT INTO projects_technologies (project_id, technology_id) VALUES (?, ?)`;
                    return new Promise((resolve, reject) => {
                        db_pool.query(queryTechnology, [projectId, id], (err3) => {
                            if (err3) {
                                console.error(`DB Error (projects_technologies) for technology ID ${id}:`, err3);
                                return reject({ message: `שגיאה בהוספת טכנולוגיה ID ${id}: ${err3.message}` });
                            }
                            resolve();
                        });
                    });
                });

                Promise.all(technologyPromises)
                    .then(() => {
                        //console.log("הטכנולוגיות נוספו בהצלחה");
                        next();
                    })
                    .catch(error => {
                        console.error("טעות בהוספת טכנולוגיות:", error);
                        return res.status(500).json(error);
                    });
            });
        });
    });
};

async function getProjects(req, res, next) {
    const studentId = req.user.id;
    const q = `SELECT * FROM \`projects\` WHERE student_id1 = ?;`;
    db_pool.query(q, [studentId], function (err, rows) {
        if (err) {
            return res.status(500).json({ message: "Error fetching users" });
        }
        res.projectsList = rows;
        next();
    });
}

async function getOneProject(req, res, next) {
    const studentId = req.user.id;
    const projectId = req.params.projectId;

    const q = `SELECT * FROM projects WHERE id = ? AND student_id1 = ?;`;

    db_pool.query(q, [projectId, studentId], function (err, rows) {
        if (err) {
            console.error("שגיאה בשליפת הפרויקט:", err);
            return res.status(500).json({ message: "שגיאה בשליפת הפרויקט" });
        }

        res.project = rows.length > 0 ? rows[0] : null;
        next();
    });
}

async function getProjectTechnologies(req, res, next) {
    const { projectId } = req.params;

    const q = `
        SELECT t.id, t.title, t.language
        FROM projects_technologies pt
        JOIN technology_in_use t ON pt.technology_id = t.id
        WHERE pt.project_id = ?
    `;

    try {
        const [rows] = await db_pool.promise().query(q, [projectId]);
        res.technologies = rows;
        next();
    } catch (err) {
        console.error("שגיאה בקבלת טכנולוגיות:", err);
        res.status(500).json({ message: 'שגיאה בקבלת טכנולוגיות הפרויקט' });
    }
}

const editProject = (req, res, next) => {
    const { projectId, projectName, projectDesc, linkToGithub, selectedTechnologies } = req.body;
    const studentId = req.user.id;

    if (
        !projectId ||
        !projectName ||
        !projectDesc ||
        !studentId ||
        !selectedTechnologies ||
        !Array.isArray(selectedTechnologies) ||
        selectedTechnologies.length === 0 ||
        selectedTechnologies.some(tech => !tech.id)
    ) {
        return res.status(400).json({ message: "חסרים פרטי פרויקט, טכנולוגיות, זיהוי משתמש או מזהה פרויקט" });
    }

    if (linkToGithub && !/^https:\/\/github\.com\/.+$/.test(linkToGithub)) {
        return res.status(400).json({ message: "נא להזין קישור תקין ל-GitHub" });
    }

    const queryCheckProject = `SELECT id FROM projects WHERE id = ? AND student_id1 = ?`;
    db_pool.query(queryCheckProject, [projectId, studentId], (err, results) => {
        if (err) {
            console.error("DB Error (check project):", err);
            return res.status(500).json({ message: "שגיאה בבדיקת הפרויקט" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "הפרויקט לא נמצא או שאין לך הרשאה לערוך אותו" });
        }

        const queryCheckDuplicate = `SELECT id FROM projects WHERE title = ? AND id != ?`;
        db_pool.query(queryCheckDuplicate, [projectName, projectId], (err, results) => {
            if (err) {
                console.error("DB Error (check duplicate):", err);
                return res.status(500).json({ message: "שגיאה בבדיקת שם הפרויקט" });
            }

            if (results.length > 0) {
                return res.status(409).json({ message: "כבר קיים פרויקט בשם זה. אנא בחר שם אחר." });
            }

            const queryUpdateProject = `UPDATE projects SET title = ?, description = ?, link_to_github = ? WHERE id = ?`;
            db_pool.query(queryUpdateProject, [projectName, projectDesc, linkToGithub || null, projectId], (err) => {
                if (err) {
                    console.error("DB Error (update project):", err);
                    return res.status(500).json({ message: "שגיאה בעדכון פרטי הפרויקט" });
                }

                const queryDeleteTechnologies = `DELETE FROM projects_technologies WHERE project_id = ?`;
                db_pool.query(queryDeleteTechnologies, [projectId], (err) => {
                    if (err) {
                        console.error("DB Error (delete technologies):", err);
                        return res.status(500).json({ message: "שגיאה במחיקת הטכנולוגיות הקיימות" });
                    }

                    const technologyPromises = selectedTechnologies.map(({ id }) => {
                        const queryTechnology = `INSERT INTO projects_technologies (project_id, technology_id) VALUES (?, ?)`;
                        return new Promise((resolve, reject) => {
                            db_pool.query(queryTechnology, [projectId, id], (err3) => {
                                if (err3) {
                                    console.error(`DB Error (projects_technologies) for technology ID ${id}:`, err3);
                                    return reject({ message: `שגיאה בהוספת טכנולוגיה ID ${id}: ${err3.message}` });
                                }
                                resolve();
                            });
                        });
                    });

                    Promise.all(technologyPromises)
                        .then(() => {
                            return res.status(200).json({ message: "הפרויקט עודכן בהצלחה" });
                        })
                        .catch(error => {
                            console.error("טעות בהוספת טכנולוגיות:", error);
                            return res.status(500).json(error);
                        });
                });
            });
        });
    });
};

const deleteProject = (req, res, next) => {
    const projectId = req.params.projectId;
    const studentId = req.user.id;

    if (!projectId || isNaN(projectId)) {
        return res.status(400).json({ message: "מזהה פרויקט לא תקין" });
    }

    const queryCheckProject = `SELECT id FROM projects WHERE id = ? AND student_id1 = ?`;
    db_pool.query(queryCheckProject, [projectId, studentId], (err, results) => {
        if (err) {
            console.error("DB Error (check project):", err);
            return res.status(500).json({ message: "שגיאה בבדיקת הפרויקט" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "הפרויקט לא נמצא או שאין לך הרשאה למחוק אותו" });
        }

        const queryUpdateStudent = `UPDATE students SET project_id = NULL WHERE id = ? AND project_id = ?`;
        db_pool.query(queryUpdateStudent, [studentId, projectId], (err) => {
            if (err) {
                console.error("DB Error (update student):", err);
                return res.status(500).json({ message: "שגיאה בעדכון פרטי הסטודנט" });
            }

            const queryDeleteTechnologies = `DELETE FROM projects_technologies WHERE project_id = ?`;
            db_pool.query(queryDeleteTechnologies, [projectId], (err) => {
                if (err) {
                    console.error("DB Error (delete technologies):", err);
                    return res.status(500).json({ message: "שגיאה במחיקת טכנולוגיות הפרויקט" });
                }

                const queryDeleteProject = `DELETE FROM projects WHERE id = ?`;
                db_pool.query(queryDeleteProject, [projectId], (err) => {
                    if (err) {
                        console.error("DB Error (delete project):", err);
                        return res.status(500).json({ message: "שגיאה במחיקת הפרויקט" });
                    }

                    const fileName = `${projectId}.pdf`;
                    const filePath = path.join(__dirname, '..', '..', 'filesApp', fileName);
                    if (fs.existsSync(filePath)) {
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error("Error deleting PDF file:", err);
                            }
                            next();
                        });
                    } else {
                        next();
                    }
                });
            });
        });
    });
};

const getProjectFile = (req, res, next) => {
    const projectId = req.params.projectId;

    if (!projectId || isNaN(projectId)) {
        return res.status(400).json({ message: 'projectId לא תקין' });
    }

    const fileName = `${projectId}.pdf`;
    const filePath = path.join(__dirname, '..', '..', 'filesApp', fileName);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: `קובץ PDF לא נמצא עבור מזהה הפרויקט: ${fileName}` });
    }

    res.filePath = filePath;
    next();
};
module.exports = {
    addProject,
    getProjects,
    getOneProject,
    getProjectTechnologies,
    getProjectFile,
    editProject,
    deleteProject,
};