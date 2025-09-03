const path = require('path');
const fs = require('fs');

//role only for students
async function addProject(req, res, next) {
    const { projectName, projectDesc, linkToGithub, selectedTechnologies } = req.body;
    const studentId = req.user.id;
    const departmentId = req.user.department_id;

    if (
        !projectName ||
        !projectDesc ||
        !studentId ||
        !selectedTechnologies ||
        !Array.isArray(selectedTechnologies) ||
        selectedTechnologies.length === 0 ||
        selectedTechnologies.some(tech => !tech.id)
    ) {
        res.addStatus = 400;
        res.addMessage = "חסרים פרטי פרויקט, טכנולוגיות או מזהה משתמש";
        return next();
    }

    if (projectName.length > 25) {
        res.addStatus = 400;
        res.addMessage = "שם הפרויקט לא יכול להיות ארוך מ-25 תווים";
        return next();
    }

    if (linkToGithub && !/^https:\/\/github\.com\/.+$/.test(linkToGithub)) {
        res.addStatus = 400;
        res.addMessage = "יש להזין קישור תקין ל-GitHub";
        return next();
    }

    const queryCheckDuplicate = `SELECT id FROM projects WHERE title = ?`;
    db_pool.query(queryCheckDuplicate, [projectName], (err, results) => {
        if (err) {
            res.addStatus = 500;
            res.addMessage = "שגיאה בבדיקת שם פרויקט";
            return next();
        }

        if (results.length > 0) {
            res.addStatus = 409;
            res.addMessage = "פרויקט בשם זה כבר קיים. אנא בחר שם אחר.";
            return next();
        }

        const queryProject = `INSERT INTO projects (title, description, student_id1, link_to_github, department_id) VALUES (?, ?, ?, ?, ?)`;
        db_pool.query(queryProject, [projectName, projectDesc, studentId, linkToGithub || null, departmentId], (err, result) => {
            if (err) {
                res.addStatus = 500;
                res.addMessage = "שגיאה בהוספת פרויקט";
                return next();
            }

            const projectId = result.insertId;

            const queryUpdateStudent = `UPDATE students SET project_id = ? WHERE id = ?`;
            db_pool.query(queryUpdateStudent, [projectId, studentId], (err2) => {
                if (err2) {
                    res.addStatus = 500;
                    res.addMessage = "שגיאה בעדכון סטודנט";
                    return next();
                }

                const technologyPromises = selectedTechnologies.map(({ id }) => {
                    const queryTechnology = `INSERT INTO projects_technologies (project_id, technology_id) VALUES (?, ?)`;
                    return new Promise((resolve, reject) => {
                        db_pool.query(queryTechnology, [projectId, id], (err3) => {
                            if (err3) {
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
                                res.addStatus = 201;
                                res.addMessage = "הפרויקט נוצר, אך לא ניתן היה לקבל את פרטי הפרויקט";
                                res.projectData = null;
                            } else {
                                res.addStatus = 201;
                                res.addMessage = "הפרויקט נוצר בהצלחה!";
                                res.projectData = rows[0];
                            }
                            next();
                        });
                    })
                    .catch(error => {
                        res.addStatus = 500;
                        res.addMessage = error.message || "שגיאה בהוספת טכנולוגיות";
                        next();
                    });
            });
        });
    });
}

//role for student instructor admin
async function getProjects(req, res, next) {
    const userId = req.user?.id;
    if (!userId) {
        res.getStatus = 401;
        res.getMessage = "נדרש להתחבר";
        return next();
    }

    const cookieNames = Object.keys(req.cookies);
    const type = cookieNames[0];

    try {
        const accessInfo = await getUserRoleAndProjectAccess(userId, type, null);

        let query = `
            SELECT p.*,
                   s1.first_name AS student1_first_name, s1.last_name AS student1_last_name,
                   s2.first_name AS student2_first_name, s2.last_name AS student2_last_name
            FROM projects p
                     LEFT JOIN students s1 ON p.student_id1 = s1.id
                     LEFT JOIN students s2 ON p.student_id2 = s2.id
        `;
        const params = [];

        if (accessInfo.role === 'student') {
            query += ` WHERE p.student_id1 = ? OR p.student_id2 = ?`;
            params.push(userId, userId);
        } else if (accessInfo.role === 'instructor' && !accessInfo.isAdmin) {
            query += ` WHERE p.instructor_id = ?`;
            params.push(userId);
        } else if (accessInfo.isAdmin) {
            query += ` WHERE p.department_id = ?`;
            params.push(accessInfo.department_id);
        } else {
            res.getStatus = 403;
            res.getMessage = "אין לך הרשאה לצפות בפרויקטים";
            return next();
        }

        db_pool.query(query, params, (err, rows) => {
            if (err) {
                res.getStatus = 500;
                res.getMessage = "שגיאה בקבלת פרויקטים";
                return next();
            }

            res.getStatus = 200;
            res.projectsList = rows;
            next();
        });

    } catch (err) {
        res.getStatus = 500;
        res.getMessage = "שגיאה בבדיקת הרשאות";
        next();
    }
}

//role for student instructor admin
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

    const cookieNames = Object.keys(req.cookies);
    const type = cookieNames[0];

    try {
        const accessInfo = await getUserRoleAndProjectAccess(userId, type, projectId);

        if (!accessInfo.hasAccessToProject) {
            res.getStatus = 403;
            res.getMessage = "אין לך גישה לפרויקט זה";
            return next();
        }

        let query = `SELECT p.*,
                            s1.first_name AS student1_first_name, s1.last_name AS student1_last_name,
                            s2.first_name AS student2_first_name, s2.last_name AS student2_last_name
                     FROM projects p
                              LEFT JOIN students s1 ON p.student_id1 = s1.id
                              LEFT JOIN students s2 ON p.student_id2 = s2.id
                     WHERE p.id = ?`;
        const params = [projectId];

        if (accessInfo.role === 'student') {
            query += ` AND (p.student_id1 = ? OR p.student_id2 = ?)`;
            params.push(userId, userId);
        } else if (accessInfo.role === 'instructor' && !accessInfo.isAdmin) {
            query += ` AND p.instructor_id = ?`;
            params.push(userId);
        } else if (accessInfo.isAdmin) {
            query += ` AND p.department_id = ?`;
            params.push(accessInfo.department_id);
        }

        db_pool.query(query, params, (err, rows) => {
            if (err) {
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
            res.projectData = rows[0];
            next();
        });

    } catch (err) {
        res.getStatus = 500;
        res.getMessage = "שגיאה בבדיקת הרשאות";
        next();
    }
}

//role for student instructor admin
async function getProjectTechnologies(req, res, next) {
    const { projectId } = req.params;
    const userId = req.user?.id;

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

    const cookieNames = Object.keys(req.cookies);
    const type = cookieNames[0];

    try {
        const accessInfo = await getUserRoleAndProjectAccess(userId, type, projectId);

        if (!accessInfo.hasAccessToProject) {
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
            res.technologies = rows;
            next();
        });

    } catch (err) {
        res.getStatus = 500;
        res.getMessage = "שגיאה בבדיקת הרשאות";
        next();
    }
}

//role only for students
async function editProject(req, res, next) {
    const { projectName, projectDesc, linkToGithub, selectedTechnologies } = req.body;
    const projectId = req.params.projectId;
    const userId = req.user?.id;

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

    const cookieNames = Object.keys(req.cookies);
    const type = cookieNames[0];

    try {
        const accessInfo = await getUserRoleAndProjectAccess(userId, type, projectId);

        if (!accessInfo.hasAccessToProject || accessInfo.role !== 'student') {
            res.updateStatus = 403;
            res.updateMessage = "אין לך הרשאה לערוך את הפרויקט הזה";
            return next();
        }

        const queryCheckDuplicate = `SELECT id FROM projects WHERE title = ? AND id != ?`;
        db_pool.query(queryCheckDuplicate, [projectName, projectId], (err, results) => {
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

            const queryUpdateProject = `UPDATE projects SET title = ?, description = ?, link_to_github = ? WHERE id = ?`;
            db_pool.query(queryUpdateProject, [projectName, projectDesc, linkToGithub || null, projectId], (err) => {
                if (err) {
                    res.updateStatus = 500;
                    res.updateMessage = "שגיאה בעדכון פרטי פרויקט";
                    return next();
                }

                const queryDeleteTechnologies = `DELETE FROM projects_technologies WHERE project_id = ?`;
                db_pool.query(queryDeleteTechnologies, [projectId], (err) => {
                    if (err) {
                        res.updateStatus = 500;
                        res.updateMessage = "שגיאה במחיקת טכנולוגיות קיימות";
                        return next();
                    }

                    const technologyPromises = selectedTechnologies.map(({ id }) => {
                        return new Promise((resolve, reject) => {
                            db_pool.query(
                                `INSERT INTO projects_technologies (project_id, technology_id) VALUES (?, ?)`,
                                [projectId, id],
                                (err3) => {
                                    if (err3) return reject(err3);
                                    resolve();
                                }
                            );
                        });
                    });

                    Promise.all(technologyPromises)
                        .then(() => {
                            db_pool.query(`SELECT * FROM projects WHERE id = ?`, [projectId], (err, rows) => {
                                if (err || !rows || rows.length === 0) {
                                    res.updateStatus = 200;
                                    res.updateMessage = "הפרויקט עודכן, אך לא ניתן היה לקבל את פרטי הפרויקט";
                                    res.projectData = null;
                                } else {
                                    res.updateStatus = 200;
                                    res.updateMessage = "הפרויקט עודכן בהצלחה!";
                                    res.projectData = rows[0];
                                }
                                next();
                            });
                        })
                        .catch(error => {
                            res.updateStatus = 500;
                            res.updateMessage = error.message || "שגיאה בהוספת טכנולוגיות";
                            next();
                        });
                });
            });
        });
    } catch (err) {
        res.updateStatus = 500;
        res.updateMessage = "שגיאה בבדיקת הרשאות";
        next();
    }
}

//role only for students
async function deleteProject(req, res, next) {
    const projectId = req.params.projectId;
    const userId = req.user?.id;

    if (!projectId || isNaN(projectId)) {
        res.deleteStatus = 400;
        res.deleteMessage = "מזהה פרויקט לא תקין";
        return next();
    }

    const cookieNames = Object.keys(req.cookies);
    const type = cookieNames[0];

    try {
        const accessInfo = await getUserRoleAndProjectAccess(userId, type, projectId);

        if (!accessInfo.hasAccessToProject || accessInfo.role !== 'student') {
            res.deleteStatus = 403;
            res.deleteMessage = "אין לך הרשאה למחוק את הפרויקט הזה";
            return next();
        }

        db_pool.query(
            `UPDATE students SET project_id = NULL WHERE id = ? AND project_id = ?`,
            [userId, projectId],
            (err) => {
                if (err) {
                    res.deleteStatus = 500;
                    res.deleteMessage = "שגיאה בעדכון סטודנט";
                    return next();
                }

                db_pool.query(
                    `DELETE FROM projects_technologies WHERE project_id = ?`,
                    [projectId],
                    (err) => {
                        if (err) {
                            res.deleteStatus = 500;
                            res.deleteMessage = "שגיאה במחיקת טכנולוגיות";
                            return next();
                        }

                        db_pool.query(
                            `DELETE FROM projects WHERE id = ?`,
                            [projectId],
                            (err) => {
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
                                        res.deletedProject = { id: projectId };
                                    }
                                    next();
                                });
                            }
                        );
                    }
                );
            }
        );

    } catch (err) {
        res.deleteStatus = 500;
        res.deleteMessage = "שגיאה בבדיקת הרשאות";
        next();
    }
}

//role for student instructor admin
async function getProjectFile(req, res, next) {
    const projectId = req.params.projectId;
    const userId = req.user?.id;

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

    const cookieNames = Object.keys(req.cookies);
    const type = cookieNames[0];

    try {
        const accessInfo = await getUserRoleAndProjectAccess(userId, type, projectId);

        if (!accessInfo.hasAccessToProject) {
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

async function getUserRoleAndProjectAccess(userId, cookieName, projectId = null) {
    const promisePool = db_pool.promise();

    if (cookieName.toLowerCase() === 'students') {
        if (projectId) {
            const [projectRows] = await promisePool.query(
                `SELECT * FROM projects WHERE id = ? AND (student_id1 = ? OR student_id2 = ?)`,
                [projectId, userId, userId]
            );
            return { role: 'student', isAdmin: false, hasAccessToProject: projectRows.length > 0 };
        } else {
            return { role: 'student', isAdmin: false };
        }
    }

    if (cookieName.toLowerCase() === 'instructors') {
        const [instructorRows] = await promisePool.query(
            `SELECT is_admin, department_id FROM instructor WHERE id = ?`,
            [userId]
        );

        if (instructorRows.length === 0) {
            return { role: 'unknown', isAdmin: false, hasAccessToProject: false };
        }

        const isAdmin = instructorRows[0].is_admin === 1;
        const instructorDept = instructorRows[0].department_id;

        if (projectId) {
            const [projectRows] = await promisePool.query(
                `SELECT instructor_id, department_id FROM projects WHERE id = ?`,
                [projectId]
            );

            if (projectRows.length === 0) {
                return { role: 'instructor', isAdmin, hasAccessToProject: false, department_id: instructorDept };
            }

            const project = projectRows[0];
            let hasAccess = false;
            if (isAdmin && project.department_id === instructorDept) hasAccess = true;
            else if (project.instructor_id === userId) hasAccess = true;

            return { role: 'instructor', isAdmin, hasAccessToProject: hasAccess, department_id: instructorDept };
        } else {
            return { role: 'instructor', isAdmin, department_id: instructorDept };
        }
    }

    return { role: 'unknown', isAdmin: false };
}

module.exports = {
    addProject,
    getProjects,
    getOneProject,
    getProjectTechnologies,
    getProjectFile,
    editProject,
    deleteProject,
};