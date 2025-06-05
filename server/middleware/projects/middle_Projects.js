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
            db_pool.query(queryUpdateStudent, [projectId, studentId], (err2, result2) => {
                if (err2) {
                    console.error("DB Error (students update):", err2);
                    return res.status(500).json({ message: "שגיאה בעדכון הסטודנט" });
                }

                const technologyPromises = selectedTechnologies.map(({ id }) => {
                    const queryTechnology = `INSERT INTO projects_technologies (project_id, technology_id) VALUES (?, ?)`;
                    return new Promise((resolve, reject) => {
                        db_pool.query(queryTechnology, [projectId, id], (err3, result3) => {
                            if (err3) {
                                console.error(`DB Error (projects_technologies) for technology ID ${id}:`, err3);
                                reject({ message: `שגיאה בהוספת טכנולוגיה ID ${id}: ${err3.message}` });
                            }
                            resolve(result3);
                        });
                    });
                });

                Promise.all(technologyPromises)
                    .then(() => {
                        console.log("הטכנולוגיות נוספו בהצלחה");
                        res.status(200).json({ message: "הפרויקט נוסף בהצלחה" });
                        next();
                    })
                    .catch(error => {
                        console.error(error);
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

const getProjectFile = (req, res, next) => {
    const projectId = req.params.projectId;
    const studentId = req.user.id;

    const q = `SELECT title FROM projects WHERE id = ? AND student_id1 = ?`;

    db_pool.query(q, [projectId, studentId], (err, results) => {
        if (err) {
            console.error('שגיאה בשליפת הפרויקט:', err);
            return res.status(500).json({ message: 'שגיאה בשליפת הפרויקט' });
        }

        if (results.length === 0) {
            return res.status(403).json({ message: 'אין לך הרשאה לגשת לקובץ זה' });
        }

        const projectTitle = results[0].title;
        const safeTitle = projectTitle.replace(/[^a-zA-Z0-9א-ת _-]/g, '').replace(/\s+/g, '_');
        const fileName = `${safeTitle}.pdf`;
        const filePath = path.join(__dirname, '..', '..', 'filesApp', fileName);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'קובץ PDF לא נמצא עבור שם הפרויקט: ' + fileName });
        }

        res.filePath = filePath;
        next();
    });
};

module.exports = {
    addProject,
    getProjects,
    getOneProject,
    getProjectTechnologies,
    getProjectFile,
};