const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const middleRole = require("../role");
const addNotification = require("../../services/notificationsService").addNotification;

//role only for students//
async function addProject(req, res, next) {
    const { projectName, projectDesc, linkToGithub, selectedTechnologies } = req.body;
    const user = req.user;

    if (req.user.role !== "student") {
        res.getStatus = 403;
        res.getMessage = "רק סטודנט יכול להוסיף פרויקט";
        return next();
    }

    const studentId = user.id;
    const departmentId = user.department_id;

    if (
        !projectName ||
        !projectDesc ||
        !studentId ||
        !selectedTechnologies ||
        !Array.isArray(selectedTechnologies) ||
        selectedTechnologies.length === 0 ||
        selectedTechnologies.some(tech => !tech.id)
    ) {
        res.getStatus = 400;
        res.getMessage = "חסרים פרטי פרויקט, טכנולוגיות או מזהה משתמש";
        return next();
    }

    if (projectName.length > 25) {
        res.getStatus = 400;
        res.getMessage = "שם הפרויקט לא יכול להיות ארוך מ-25 תווים";
        return next();
    }

    if (linkToGithub && !/^https:\/\/github\.com\/.+$/.test(linkToGithub)) {
        res.getStatus = 400;
        res.getMessage = "יש להזין קישור תקין ל-GitHub";
        return next();
    }

    try {
        const [existing] = await db_pool.promise().query(
            `SELECT id FROM projects WHERE title = ?`,
            [projectName]
        );

        if (existing.length > 0) {
            res.getStatus = 409;
            res.getMessage = "פרויקט בשם זה כבר קיים. אנא בחר שם אחר.";
            return next();
        }

        const [result] = await db_pool.promise().query(
            `INSERT INTO projects (title, description, student_id1, link_to_github, department_id) VALUES (?, ?, ?, ?, ?)`,
            [projectName, projectDesc, studentId, linkToGithub || null, departmentId]
        );

        const projectId = result.insertId;

        await db_pool.promise().query(
            `UPDATE students SET project_id = ? WHERE id = ?`,
            [projectId, studentId]
        );

        const technologyPromises = selectedTechnologies.map(({ id }) =>
            db_pool.promise().query(
                `INSERT INTO projects_technologies (project_id, technology_id) VALUES (?, ?)`,
                [projectId, id]
            )
        );
        await Promise.all(technologyPromises);

        try {
            await addNotification(
                studentId,
                'student',
                'פרויקט נפתח בהצלחה',
                `הפרויקט ${projectName} נפתח בהצלחה במערכת. אתה יכול להתחיל לעבוד עליו.`,
                'system',
                projectId
            );
        } catch (notifErr) {
            console.error('שגיאה ביצירת התראה:', notifErr);
        }

        res.getStatus = 201;
        res.getMessage = "הפרויקט נוצר בהצלחה!";
        next();

    } catch (err) {
        res.getStatus = 500;
        res.getMessage = "שגיאה ביצירת הפרויקט";
        next();
    }
}

//role for student instructor admin//
async function getProjects(req, res, next) {
    const user = req.user;

    if (!user) {
        res.getStatus = 401;
        res.getMessage = "נדרש להתחבר";
        res.data = [];
        return next();
    }

    try {
        let query = `
            SELECT p.*,
                   s1.first_name AS student1_first_name, s1.last_name AS student1_last_name,
                   s2.first_name AS student2_first_name, s2.last_name AS student2_last_name
            FROM projects p
                     LEFT JOIN students s1 ON p.student_id1 = s1.id
                     LEFT JOIN students s2 ON p.student_id2 = s2.id
        `;
        const params = [];

        if (user.role === "student") {
            query += ` WHERE p.student_id1 = ? OR p.student_id2 = ?`;
            params.push(user.id, user.id);
        } else if (user.role === "instructor" && !user.isAdmin) {
            query += ` WHERE p.instructor_id = ?`;
            params.push(user.id);
        } else if (user.role === "instructor" && user.isAdmin) {
            query += ` WHERE p.department_id = ?`;
            params.push(user.department_id);
        } else {
            res.getStatus = 403;
            res.getMessage = "אין לך הרשאה לצפות בפרויקטים";
            res.data = [];
            return next();
        }

        db_pool.query(query, params, (err, rows) => {
            if (err) {
                res.getStatus = 500;
                res.getMessage = "שגיאה בקבלת פרויקטים";
                res.data = [];
                return next();
            }

            res.getStatus = 200;
            res.getMessage = "הצלחה בהחזרת נתונים";
            res.data = rows;
            next();
        });

    } catch (err) {
        res.getStatus = 500;
        res.getMessage = "שגיאה בבדיקת הרשאות";
        res.data = [];
        next();
    }
}

//role for student instructor admin//
async function getOneProject(req, res, next) {
    const userId = req.user?.id;
    const projectId = req.params.projectId;

    if (!userId) {
        res.getStatus = 401;
        res.getMessage = "נדרש להתחבר";
        return next();
    }

    if (!projectId || isNaN(projectId)) {
        res.getStatus = 400;
        res.getMessage = "מזהה פרויקט לא תקין";
        return next();
    }

    const type = req.user.role;

    try {
        const accessInfo = await middleRole.checkUserProjectAccess(userId, type, projectId);

        if (!accessInfo.hasAccess) {
            res.getStatus = 403;
            res.getMessage = "אין לך גישה לפרויקט זה";
            return next();
        }

        let query = `
            SELECT p.*,
                   s1.first_name AS student1_first_name,
                   s1.last_name AS student1_last_name,
                   s2.first_name AS student2_first_name,
                   s2.last_name AS student2_last_name,
                   i.first_name AS instructor_first_name,
                   i.last_name AS instructor_last_name
            FROM projects p
                     LEFT JOIN students s1 ON p.student_id1 = s1.id
                     LEFT JOIN students s2 ON p.student_id2 = s2.id
                     LEFT JOIN instructor i ON p.instructor_id = i.id
            WHERE p.id = ?
        `;

        const params = [projectId];

        // התאמות לפי סוג המשתמש
        if (accessInfo.role === 'student') {
            query += ` AND (p.student_id1 = ? OR p.student_id2 = ?)`;
            params.push(userId, userId);
        } else if (accessInfo.role === 'instructor' && !accessInfo.isAdmin) {
            query += ` AND p.instructor_id = ?`;
            params.push(userId);
        } else if (accessInfo.isAdmin) {
            query += ` AND p.department_id = ?`;
            params.push(accessInfo.departmentId);
        }

        db_pool.query(query, params, (err, rows) => {
            if (err) {
                console.log(err);
                res.getStatus = 500;
                res.getMessage = "שגיאה בקבלת פרויקט";
                return next();
            }

            if (!rows || rows.length === 0) {
                res.getStatus = 404;
                res.getMessage = "הפרויקט לא נמצא";
                return next();
            }

            res.getStatus = 200;
            res.data = rows[0];
            next();
        });

    } catch (err) {
        console.error(err);
        res.getStatus = 500;
        res.getMessage = "שגיאה בבדיקת הרשאות";
        next();
    }
}

// role only for students//
async function editProject(req, res, next) {
    const { projectName, projectDesc, linkToGithub, selectedTechnologies } = req.body;
    const projectId = req.params.projectId;
    const userId = req.user?.id;
    const type = req.user?.role;

    if (
        !projectId ||
        !projectName ||
        !projectDesc ||
        !userId ||
        !selectedTechnologies ||
        !Array.isArray(selectedTechnologies) ||
        selectedTechnologies.length === 0 ||
        selectedTechnologies.some(tech => !tech.id)
    ) {
        res.updateStatus = 400;
        res.updateMessage = "חסרים פרטי פרויקט, טכנולוגיות, מזהה משתמש או מזהה פרויקט";
        return next();
    }

    if (linkToGithub && !/^https:\/\/github\.com\/.+$/.test(linkToGithub)) {
        res.updateStatus = 400;
        res.updateMessage = "יש להזין קישור תקין ל-GitHub";
        return next();
    }

    try {
        const accessInfo = await middleRole.checkUserProjectAccess(userId, type, projectId);

        if (!accessInfo.hasAccess || accessInfo.role !== 'student') {
            res.updateStatus = 403;
            res.updateMessage = "אין לך הרשאה לערוך את הפרויקט הזה";
            return next();
        }

        db_pool.query(
            `SELECT id FROM projects WHERE title = ? AND id != ?`,
            [projectName, projectId],
            (err, results) => {
                if (err) {
                    res.updateStatus = 500;
                    res.updateMessage = "שגיאה בבדיקת שם פרויקט";
                    return next();
                }
                if (results.length > 0) {
                    res.updateStatus = 409;
                    res.updateMessage = "פרויקט בשם זה כבר קיים. אנא בחר שם אחר.";
                    return next();
                }

                db_pool.query(
                    `UPDATE projects SET title = ?, description = ?, link_to_github = ? WHERE id = ?`,
                    [projectName, projectDesc, linkToGithub || null, projectId],
                    (err) => {
                        if (err) {
                            res.updateStatus = 500;
                            res.updateMessage = "שגיאה בעדכון פרטי פרויקט";
                            return next();
                        }

                        db_pool.query(`DELETE FROM projects_technologies WHERE project_id = ?`, [projectId], (err) => {
                            if (err) {
                                res.updateStatus = 500;
                                res.updateMessage = "שגיאה במחיקת טכנולוגיות קיימות";
                                return next();
                            }

                            const techPromises = selectedTechnologies.map(({ id }) => {
                                return new Promise((resolve, reject) => {
                                    db_pool.query(
                                        `INSERT INTO projects_technologies (project_id, technology_id) VALUES (?, ?)`,
                                        [projectId, id],
                                        (err3) => err3 ? reject(err3) : resolve()
                                    );
                                });
                            });

                            Promise.all(techPromises)
                                .then(() => {
                                    res.updateStatus = 200;
                                    res.updateMessage = "הפרויקט עודכן בהצלחה!";
                                    next();
                                })
                                .catch(error => {
                                    res.updateStatus = 500;
                                    res.updateMessage = error.message || "שגיאה בהוספת טכנולוגיות";
                                    next();
                                });
                        });
                    }
                );
            }
        );

    } catch (err) {
        res.updateStatus = 500;
        res.updateMessage = "שגיאה בבדיקת הרשאות";
        next();
    }
}

// role only for students//
async function deleteProject(req, res, next) {
    const projectId = req.params.projectId;
    const userId = req.user?.id;
    const type = req.user?.role;

    if (!projectId || isNaN(projectId)) {
        res.deleteStatus = 400;
        res.deleteMessage = "מזהה פרויקט לא תקין";
        return next();
    }

    try {
        const accessInfo = await middleRole.checkUserProjectAccess(userId, type, projectId);

        if (!accessInfo.hasAccess || accessInfo.role !== 'student') {
            res.deleteStatus = 403;
            res.deleteMessage = "אין לך הרשאה למחוק את הפרויקט הזה";
            return next();
        }

        db_pool.query(`UPDATE students SET project_id = NULL WHERE id = ? AND project_id = ?`, [userId, projectId], (err) => {
            if (err) {
                res.deleteStatus = 500;
                res.deleteMessage = "שגיאה בעדכון סטודנט";
                return next();
            }

            db_pool.query(`DELETE FROM projects_technologies WHERE project_id = ?`, [projectId], (err) => {
                if (err) {
                    res.deleteStatus = 500;
                    res.deleteMessage = "שגיאה במחיקת טכנולוגיות";
                    return next();
                }

                db_pool.query(`DELETE FROM notifications WHERE project_id = ?`, [projectId], (err) => {
                    if (err) {
                        res.deleteStatus = 500;
                        res.deleteMessage = "שגיאה במחיקת ההתראות של הפרויקט";
                        return next();
                    }

                    db_pool.query(`DELETE FROM projects WHERE id = ?`, [projectId], (err) => {
                        if (err) {
                            res.deleteStatus = 500;
                            res.deleteMessage = "שגיאה במחיקת פרויקט";
                            return next();
                        }

                        const filePath = path.join(__dirname, '..', '..', 'filesApp', `${projectId}.pdf`);
                        fs.unlink(filePath, (err) => {
                            if (err && err.code !== 'ENOENT') {
                                res.deleteStatus = 500;
                                res.deleteMessage = "הפרויקט נמחק, אך שגיאה במחיקת קובץ הפרויקט";
                            } else {
                                res.deleteStatus = 200;
                                res.deleteMessage = "הפרויקט נמחק בהצלחה!";
                            }
                            next();
                        });
                    });
                });
            });
        });

    } catch (err) {
        res.deleteStatus = 500;
        res.deleteMessage = "שגיאה בבדיקת הרשאות";
        next();
    }
}

// role for student, instructor, admin
async function getProjectTechnologies(req, res, next) {
    const { projectId } = req.params;
    const userId = req.user?.id;
    const type = req.user?.role;

    if (!userId) {
        res.getStatus = 401;
        res.getMessage = "נדרש להתחבר";
        return next();
    }
    if (!projectId || isNaN(projectId)) {
        res.getStatus = 400;
        res.getMessage = "מזהה פרויקט לא תקין";
        return next();
    }

    try {
        const accessInfo = await middleRole.checkUserProjectAccess(userId, type, projectId);

        if (!accessInfo.hasAccess) {
            res.getStatus = 403;
            res.getMessage = "אין לך גישה לפרויקט זה";
            return next();
        }

        const q = `
            SELECT t.id, t.title, t.language
            FROM projects_technologies pt
                     JOIN technology_in_use t ON pt.technology_id = t.id
            WHERE pt.project_id = ?
        `;
        db_pool.query(q, [projectId], (err, rows) => {
            if (err) {
                res.getStatus = 500;
                res.getMessage = "שגיאה בקבלת טכנולוגיות לפרויקט";
                return next();
            }

            res.getStatus = 200;
            res.data = rows;
            res.getMessage = "טכנולוגיות נטענו בהצלחה";
            next();
        });

    } catch (err) {
        res.getStatus = 500;
        res.getMessage = "שגיאה בבדיקת הרשאות";
        next();
    }
}

// role for student, instructor, admin
async function getProjectFile(req, res, next) {
    const projectId = req.params.projectId;
    const userId = req.user?.id;
    const type = req.user?.role;

    if (!projectId || isNaN(projectId)) {
        res.getStatus = 400;
        res.getMessage = "מזהה פרויקט לא תקין";
        return next();
    }

    if (!userId) {
        res.getStatus = 401;
        res.getMessage = "לא נמצא מזהה משתמש";
        return next();
    }

    try {
        const accessInfo = await middleRole.checkUserProjectAccess(userId, type, projectId);

        if (!accessInfo.hasAccess) {
            res.getStatus = 403;
            res.getMessage = "אין לך הרשאה לגשת לקובץ הפרויקט הזה";
            return next();
        }

        const fileName = `${projectId}.pdf`;
        const filePath = path.join(__dirname, "..", "..", "filesApp", fileName);

        if (!fs.existsSync(filePath)) {
            res.getStatus = 404;
            res.getMessage = `לא נמצא קובץ PDF עבור מזהה פרויקט: ${fileName}`;
            return next();
        }

        res.getStatus = 200;
        res.filePath = filePath;
        next();

    } catch (err) {
        res.getStatus = 500;
        res.getMessage = "שגיאה בבדיקת הרשאות";
        next();
    }
}

// role only for instructor, admin
async function getProjecFilesZip(req, res, next) {
    const projectId = req.params.projectId;
    const userId = req.user?.id;
    const type = req.user?.role;

    if (!projectId || isNaN(projectId)) {
        res.getStatus = 400;
        res.getMessage = "מזהה פרויקט לא תקין";
        return next();
    }

    if (!userId) {
        res.getStatus = 401;
        res.getMessage = "לא נמצא מזהה משתמש";
        return next();
    }

    try {
        const accessInfo = await middleRole.checkUserProjectAccess(userId, type, projectId);

        if (!accessInfo.hasAccess || (accessInfo.role !== 'instructor' && accessInfo.role !== 'admin')) {
            res.getStatus = 403;
            res.getMessage = "אין לך הרשאה להוריד קבצים אלה";
            return next();
        }

        const [projectRow] = await db_pool.promise().query(
            "SELECT title FROM projects WHERE id = ?",
            [projectId]
        );

        if (!projectRow.length) {
            res.getStatus = 404;
            res.getMessage = "הפרויקט לא נמצא במסד הנתונים";
            return next();
        }

        const projectName = projectRow[0].title;

        const pdfFilePath = path.join(__dirname, "..", "..", "filesApp", `${projectId}.pdf`);
        const wordFilePath = path.join(__dirname, "..", "..", "wordFilesApp", `${projectId}.docx`);

        const imageExtensions = ['.jpg', '.jpeg', '.png'];
        let signatureFilePath = null;
        for (const ext of imageExtensions) {
            const tempPath = path.join(__dirname, "..", "..", "signatureImgApp", `${projectId}${ext}`);
            if (fs.existsSync(tempPath)) {
                signatureFilePath = tempPath;
                break;
            }
        }

        if (!fs.existsSync(pdfFilePath) && !fs.existsSync(wordFilePath) && !signatureFilePath) {
            res.getStatus = 404;
            res.getMessage = "לא נמצאו קבצים להורדה עבור הפרויקט הזה";
            return next();
        }

        res.getStatus = 200;
        res.zipFiles = {
            projectName,
            proposalFilePath: fs.existsSync(pdfFilePath) ? pdfFilePath : null,
            wordFilePath: fs.existsSync(wordFilePath) ? wordFilePath : null,
            signatureFilePath: signatureFilePath
        };

        next();
    } catch (err) {
        res.getStatus = 500;
        res.getMessage = "שגיאה בהורדת הקבצים";
        next();
    }
}


module.exports = {
    addProject,
    getProjects,
    getOneProject,
    getProjectTechnologies,
    getProjectFile,
    editProject,
    deleteProject,
    getProjecFilesZip
};