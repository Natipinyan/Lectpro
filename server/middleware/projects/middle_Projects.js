const path = require('path');
const fs = require('fs');


const addProject = (req, res) => {
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
        return res.status(400).json({ success: false, message: "חסרים פרטי פרויקט, טכנולוגיות או מזהה משתמש" });
    }

    if (projectName.length > 25) {
        return res.status(400).json({ success: false, message: "שם הפרויקט לא יכול להיות ארוך מ-25 תווים" });
    }

    if (linkToGithub && !/^https:\/\/github\.com\/.+$/.test(linkToGithub)) {
        return res.status(400).json({ success: false, message: "יש להזין קישור תקין ל-GitHub" });
    }

    const queryCheckDuplicate = `SELECT id FROM projects WHERE title = ?`;
    db_pool.query(queryCheckDuplicate, [projectName], (err, results) => {
        if (err) {
            console.error("DB Error (check duplicate):", err);
            return res.status(500).json({ success: false, message: "שגיאה בבדיקת שם פרויקט" });
        }

        if (results.length > 0) {
            return res.status(409).json({ success: false, message: "פרויקט בשם זה כבר קיים. אנא בחר שם אחר." });
        }

        const queryProject = `INSERT INTO projects (title, description, student_id1, link_to_github) VALUES (?, ?, ?, ?)`;
        db_pool.query(queryProject, [projectName, projectDesc, studentId, linkToGithub || null], (err, result) => {
            if (err) {
                console.error("DB Error (projects):", err);
                return res.status(500).json({ success: false, message: "שגיאה בהוספת פרויקט" });
            }

            const projectId = result.insertId;

            const queryUpdateStudent = `UPDATE students SET project_id = ? WHERE id = ?`;
            db_pool.query(queryUpdateStudent, [projectId, studentId], (err2) => {
                if (err2) {
                    console.error("DB Error (students update):", err2);
                    return res.status(500).json({ success: false, message: "שגיאה בעדכון סטודנט" });
                }

                const technologyPromises = selectedTechnologies.map(({ id }) => {
                    const queryTechnology = `INSERT INTO projects_technologies (project_id, technology_id) VALUES (?, ?)`;
                    return new Promise((resolve, reject) => {
                        db_pool.query(queryTechnology, [projectId, id], (err3) => {
                            if (err3) {
                                console.error(`DB Error (projects_technologies) for technology ID ${id}:`, err3);
                                return reject({ message: `שגיאה בהוספת טכנולוגיה מזהה ${id}: ${err3.message}` });
                            }
                            resolve();
                        });
                    });
                });

                Promise.all(technologyPromises)
                    .then(() => {
                        const getProjectQuery = `SELECT * FROM projects WHERE id = ?`;
                        db_pool.query(getProjectQuery, [projectId], (err, rows) => {
                            if (err || !rows || rows.length === 0) {
                                return res.status(201).json({ success: true, message: "הפרויקט נוצר, אך לא ניתן היה לקבל את פרטי הפרויקט", data: null });
                            }
                            return res.status(201).json({ success: true, message: "הפרויקט נוצר בהצלחה!", data: rows[0] });
                        });
                    })
                    .catch(error => {
                        console.error("Error adding technologies:", error);
                        return res.status(500).json({ success: false, message: error.message || "שגיאה בהוספת טכנולוגיות" });
                    });
            });
        });
    });
};

const getProjects = (req, res) => {
    const studentId = req.user.id;
    const q = `SELECT * FROM \`projects\` WHERE student_id1 = ?;`;
    db_pool.query(q, [studentId], function (err, rows) {
        if (err) {
            return res.status(500).json({ success: false, message: "שגיאה בקבלת פרויקטים" });
        }
        return res.status(200).json({ success: true, data: rows });
    });
};

const getOneProject = (req, res) => {
    const studentId = req.user.id;
    const projectId = req.params.projectId;
    const q = `SELECT * FROM projects WHERE id = ? AND student_id1 = ?;`;
    db_pool.query(q, [projectId, studentId], function (err, rows) {
        if (err) {
            console.error("Error fetching project:", err);
            return res.status(500).json({ success: false, message: "שגיאה בקבלת פרויקט" });
        }
        if (!rows || rows.length === 0) {
            return res.status(404).json({ success: false, message: "הפרויקט לא נמצא" });
        }
        return res.status(200).json({ success: true, data: rows[0] });
    });
};

const getOneProjectIns = (req, res) => {
    const projectId = req.params.projectId;
    const q = `SELECT * FROM projects WHERE id = ?`;
    db_pool.query(q, [projectId], function (err, rows) {
        if (err) {
            console.error("Error fetching project:", err);
            return res.status(500).json({ success: false, message: "שגיאה בקבלת פרויקט" });
        }
        if (!rows || rows.length === 0) {
            return res.status(404).json({ success: false, message: "הפרויקט לא נמצא" });
        }
        return res.status(200).json({ success: true, data: rows[0] });
    });
};


const getProjectTechnologies = (req, res) => {
    const { projectId } = req.params;
    const q = `SELECT t.id, t.title, t.language FROM projects_technologies pt JOIN technology_in_use t ON pt.technology_id = t.id WHERE pt.project_id = ?`;
    db_pool.query(q, [projectId], (err, rows) => {
        if (err) {
            console.error("Error fetching project technologies:", err);
            return res.status(500).json({ success: false, message: 'שגיאה בקבלת טכנולוגיות לפרויקט' });
        }
        return res.status(200).json({ success: true, data: rows });
    });
};

const editProject = (req, res) => {
    const { projectName, projectDesc, linkToGithub, selectedTechnologies } = req.body;
    const projectId = req.params.projectId;
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
        return res.status(400).json({ success: false, message: "חסרים פרטי פרויקט, טכנולוגיות, מזהה משתמש או מזהה פרויקט" });
    }

    if (linkToGithub && !/^https:\/\/github\.com\/.+$/.test(linkToGithub)) {
        return res.status(400).json({ success: false, message: "יש להזין קישור תקין ל-GitHub" });
    }

    const queryCheckProject = `SELECT id FROM projects WHERE id = ? AND student_id1 = ?`;
    db_pool.query(queryCheckProject, [projectId, studentId], (err, results) => {
        if (err) {
            console.error("DB Error (check project):", err);
            return res.status(500).json({ success: false, message: "שגיאה בבדיקת פרויקט" });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "הפרויקט לא נמצא או שאין לך הרשאה לערוך אותו" });
        }

        const queryCheckDuplicate = `SELECT id FROM projects WHERE title = ? AND id != ?`;
        db_pool.query(queryCheckDuplicate, [projectName, projectId], (err, results) => {
            if (err) {
                console.error("DB Error (check duplicate):", err);
                return res.status(500).json({ success: false, message: "שגיאה בבדיקת שם פרויקט" });
            }

            if (results.length > 0) {
                return res.status(409).json({ success: false, message: "פרויקט בשם זה כבר קיים. אנא בחר שם אחר." });
            }

            const queryUpdateProject = `UPDATE projects SET title = ?, description = ?, link_to_github = ? WHERE id = ?`;
            db_pool.query(queryUpdateProject, [projectName, projectDesc, linkToGithub || null, projectId], (err) => {
                if (err) {
                    console.error("DB Error (update project):", err);
                    return res.status(500).json({ success: false, message: "שגיאה בעדכון פרטי פרויקט" });
                }

                const queryDeleteTechnologies = `DELETE FROM projects_technologies WHERE project_id = ?`;
                db_pool.query(queryDeleteTechnologies, [projectId], (err) => {
                    if (err) {
                        console.error("DB Error (delete technologies):", err);
                        return res.status(500).json({ success: false, message: "שגיאה במחיקת טכנולוגיות קיימות" });
                    }

                    const technologyPromises = selectedTechnologies.map(({ id }) => {
                        const queryTechnology = `INSERT INTO projects_technologies (project_id, technology_id) VALUES (?, ?)`;
                        return new Promise((resolve, reject) => {
                            db_pool.query(queryTechnology, [projectId, id], (err3) => {
                                if (err3) {
                                    console.error(`DB Error (projects_technologies) for technology ID ${id}:`, err3);
                                    return reject({ message: `שגיאה בהוספת טכנולוגיה מזהה ${id}: ${err3.message}` });
                                }
                                resolve();
                            });
                        });
                    });

                    Promise.all(technologyPromises)
                        .then(() => {
                            const getProjectQuery = `SELECT * FROM projects WHERE id = ?`;
                            db_pool.query(getProjectQuery, [projectId], (err, rows) => {
                                if (err || !rows || rows.length === 0) {
                                    return res.status(200).json({ success: true, message: "הפרויקט עודכן, אך לא ניתן היה לקבל את פרטי הפרויקט", data: null });
                                }
                                return res.status(200).json({ success: true, message: "הפרויקט עודכן בהצלחה!", data: rows[0] });
                            });
                        })
                        .catch(error => {
                            console.error("Error adding technologies:", error);
                            return res.status(500).json({ success: false, message: error.message || "שגיאה בהוספת טכנולוגיות" });
                        });
                });
            });
        });
    });
};

const deleteProject = (req, res) => {
    const projectId = req.params.projectId;
    const studentId = req.user.id;

    if (!projectId || isNaN(projectId)) {
        return res.status(400).json({ message: 'מזהה פרויקט לא תקין' });
    }

    const queryCheckProject = `SELECT id FROM projects WHERE id = ? AND student_id1 = ?`;
    db_pool.query(queryCheckProject, [projectId, studentId], (err, results) => {
        if (err) {
            console.error("DB Error (check project):", err);
            return res.status(500).json({ success: false, message: "שגיאה בבדיקת פרויקט" });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "הפרויקט לא נמצא או שאין לך הרשאה למחוק אותו" });
        }

        const queryUpdateStudent = `UPDATE students SET project_id = NULL WHERE id = ? AND project_id = ?`;
        db_pool.query(queryUpdateStudent, [studentId, projectId], (err) => {
            if (err) {
                console.error("DB Error (update student):", err);
                return res.status(500).json({ success: false, message: "שגיאה בעדכון סטודנט" });
            }

            const queryDeleteTechnologies = `DELETE FROM projects_technologies WHERE project_id = ?`;
            db_pool.query(queryDeleteTechnologies, [projectId], (err) => {
                if (err) {
                    console.error("DB Error (delete technologies):", err);
                    return res.status(500).json({ success: false, message: "שגיאה במחיקת טכנולוגיות" });
                }

                const queryDeleteProject = `DELETE FROM projects WHERE id = ?`;
                db_pool.query(queryDeleteProject, [projectId], (err) => {
                    if (err) {
                        console.error("DB Error (delete project):", err);
                        return res.status(500).json({ success: false, message: "שגיאה במחיקת פרויקט" });
                    }
                    const filePath = path.join(__dirname, '..', '..', 'filesApp', `${projectId}.pdf`);
                    fs.unlink(filePath, (err) => {
                        if (err && err.code !== 'ENOENT') {
                            console.error("שגיאה במחיקת קובץ הפרויקט:", err);
                            return res.status(500).json({ success: false, message: "הפרויקט נמחק, אך שגיאה במחיקת קובץ הפרויקט" });
                        }
                        return res.status(200).json({ success: true, message: "הפרויקט נמחק בהצלחה!" });
                    });
                });
            });
        });
    });
};

const getProjectFile = (req, res) => {
    const projectId = req.params.projectId;
    if (!projectId || isNaN(projectId)) {
        return res.status(400).json({ message: 'מזהה פרויקט לא תקין' });
    }
    const fileName = `${projectId}.pdf`;
    const filePath = path.join(__dirname, '..', '..', 'filesApp', fileName);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: `לא נמצא קובץ PDF עבור מזהה פרויקט: ${fileName}` });
    }
    return res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            return res.status(500).json({ message: 'שגיאה בשליחת קובץ' });
        }
    });
};

const getProjectsByInstructor = (req, res, next) => {
    const instructorId = req.user?.id;

    if (!instructorId) {
        return res.status(401).json({ success: false, message: "נדרש להתחבר כמנחה" });
    }

    const query = `
        SELECT p.*,
               s1.first_name AS student1_first_name, s1.last_name AS student1_last_name,
               s2.first_name AS student2_first_name, s2.last_name AS student2_last_name
        FROM projects p
                 LEFT JOIN students s1 ON p.student_id1 = s1.id
                 LEFT JOIN students s2 ON p.student_id2 = s2.id
        WHERE p.instructor_id = ?
    `;

    db_pool.query(query, [instructorId], (err, rows) => {
        if (err) {
            console.error("DB Error (get projects by instructor):", err);
            return res.status(500).json({ success: false, message: "שגיאה בקבלת פרויקטים של מנחה" });
        }
        res.projectsList = rows;
        next();
    });
};


module.exports = {
    addProject,
    getProjects,
    getOneProject,
    getProjectTechnologies,
    getProjectFile,
    editProject,
    deleteProject,
    getProjectsByInstructor,
    getOneProjectIns,
};