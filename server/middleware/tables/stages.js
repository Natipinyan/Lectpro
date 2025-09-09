const middleRole = require('../../services/role');
const addNotification = require("../../services/notificationsService").addNotification;

//role admin only(to manage stages)//
async function getStagesByDepartment(req, res, next) {
    const userId = req.user?.id;
    const userDepartment = req.user?.department_id;
    const type = req.user?.role;
    const isAdmin = req.user?.isAdmin;

    if (!userId) {
        res.getStatus = 401;
        res.getMessage = "נדרש להתחבר";
        return next();
    }

    if (!userDepartment) {
        res.getStatus = 400;
        res.getMessage = "לא נמצא מזהה מגמה";
        return next();
    }

    try {
        const accessInfo = await middleRole.checkUserStageAccess(
            userId,
            type,
            userDepartment,
            { stageId: null, projectId: null }
        );

        if (!isAdmin || !accessInfo.hasAccess) {
            res.getStatus = 403;
            res.getMessage = "אין לך הרשאה לצפות בשלבים של מגמה זו";
            return next();
        }

        const query = `
            SELECT id, title, department_id,position
            FROM stages
            WHERE department_id = ?
            ORDER BY position ASC
        `;

        db_pool.query(query, [userDepartment], (err, rows) => {
            if (err) {
                res.getStatus = 500;
                res.getMessage = "שגיאה בקבלת השלבים";
                return next();
            }

            res.getStatus = 200;
            res.data = rows || [];
            next();
        });
    } catch (err) {
        res.getStatus = 500;
        res.getMessage = "שגיאה פנימית בבדיקת הרשאות";
        next();
    }
}

//role admin only//
async function addStageByDepartment(req, res, next) {
    const { title, position } = req.body;
    const userId = req.user.id;
    const type = req.user.role;
    const userDepartment = req.user.department_id;

    try {
        const accessInfo = await middleRole.checkUserStageActionAccess(userId, type, userDepartment);

        if (!accessInfo.hasAccess || !accessInfo.isAdmin) {
            res.getStatus = 403;
            res.getMessage = "אין לך הרשאה להוסיף שלבים במגמה זו";
            return next();
        }

        if (!title || title.trim() === "") {
            res.getStatus = 400;
            res.getMessage = "שדה הכותרת חובה";
            return next();
        }

        db_pool.query(
            `SELECT MAX(position) AS maxPos FROM stages WHERE department_id = ?`,
            [userDepartment],
            (err, rows) => {
                if (err) {
                    res.getStatus = 500;
                    res.getMessage = "שגיאה בבדיקת מיקום השלבים";
                    return next();
                }

                const maxPos = rows[0].maxPos || 0;
                let newPos = parseInt(position);
                if (isNaN(newPos) || newPos < 1) newPos = 1;
                else if (newPos > maxPos + 1) newPos = maxPos + 1;

                db_pool.query(
                    `UPDATE stages SET position = position + 1 WHERE department_id = ? AND position >= ?`,
                    [userDepartment, newPos],
                    (err2) => {
                        if (err2) {
                            res.getStatus = 500;
                            res.getMessage = "שגיאה בהזזת השלבים";
                            return next();
                        }

                        db_pool.query(
                            `UPDATE projects SET stage_count = stage_count + 1 WHERE department_id = ? AND stage_count >= ?`,
                            [userDepartment, newPos],
                            (errProj) => {
                                if (errProj) {
                                    res.getStatus = 500;
                                    res.getMessage = "שגיאה בעדכון שלב הפרויקטים הקיימים";
                                    return next();
                                }

                                db_pool.query(
                                    `INSERT INTO stages (title, department_id, position) VALUES (?, ?, ?)`,
                                    [title.trim(), userDepartment, newPos],
                                    (err3) => {
                                        if (err3) {
                                            res.getStatus = 500;
                                            res.getMessage = "שגיאה בהוספת השלב";
                                        } else {
                                            res.getStatus = 200;
                                            res.getMessage = "השלב נוסף בהצלחה";
                                        }
                                        next();
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );

    } catch (err) {
        res.getStatus = 500;
        res.getMessage = "שגיאה פנימית";
        next();
    }
}

//role admin only//
async function updateStage(req, res, next) {
    const { stageId } = req.params;
    const { title, position } = req.body;
    const userId = req.user.id;
    const type = req.user.role;
    const userDepartment = req.user.department_id;

    if (!title || title.trim() === "") {
        res.updateStatus = 400;
        res.updateMessage = "כותרת היא שדה חובה";
        return next();
    }

    try {
        const accessInfo = await middleRole.checkUserStageActionAccess(userId, type, userDepartment);

        if (!accessInfo.hasAccess || !accessInfo.isAdmin) {
            res.updateStatus = 403;
            res.updateMessage = "אין לך הרשאה לעדכן שלב במגמה זו";
            return next();
        }

        db_pool.query(
            `SELECT * FROM stages WHERE department_id = ? ORDER BY position ASC`,
            [userDepartment],
            (err, stages) => {
                if (err) {
                    res.updateStatus = 500;
                    res.updateMessage = "שגיאה בשליפת השלבים";
                    return next();
                }

                const stageToUpdate = stages.find(s => s.id == stageId);
                if (!stageToUpdate) {
                    res.updateStatus = 403;
                    res.updateMessage = "אין לך גישה לעדכן שלב זה";
                    return next();
                }

                const oldPos = stageToUpdate.position;
                const newPos = parseInt(position);

                if (oldPos === newPos) {
                    db_pool.query(
                        `UPDATE stages SET title = ? WHERE id = ?`,
                        [title.trim(), stageId],
                        (err) => {
                            if (err) {
                                res.updateStatus = 500;
                                res.updateMessage = "שגיאה בעדכון השלב";
                            } else {
                                res.updateStatus = 200;
                                res.updateMessage = "השלב עודכן בהצלחה";
                            }
                            return next();
                        }
                    );
                    return;
                }

                let updateQuery, updateParams, projectUpdateQuery, projectUpdateParams;

                if (newPos < oldPos) {
                    updateQuery = `
                        UPDATE stages SET position = position + 1
                        WHERE department_id = ? AND position >= ? AND position < ?`;
                    updateParams = [userDepartment, newPos, oldPos];

                    projectUpdateQuery = `
                        UPDATE projects SET stage_count = stage_count + 1
                        WHERE department_id = ? AND stage_count >= ? AND stage_count < ?`;
                    projectUpdateParams = [userDepartment, newPos, oldPos];
                } else {
                    updateQuery = `
                        UPDATE stages SET position = position - 1
                        WHERE department_id = ? AND position > ? AND position <= ?`;
                    updateParams = [userDepartment, oldPos, newPos];

                    projectUpdateQuery = `
                        UPDATE projects SET stage_count = stage_count - 1
                        WHERE department_id = ? AND stage_count > ? AND stage_count <= ?`;
                    projectUpdateParams = [userDepartment, oldPos, newPos];
                }

                db_pool.query(updateQuery, updateParams, (err2) => {
                    if (err2) {
                        res.updateStatus = 500;
                        res.updateMessage = "שגיאה בעדכון סדר השלבים";
                        return next();
                    }

                    db_pool.query(projectUpdateQuery, projectUpdateParams, (errProj) => {
                        if (errProj) {
                            res.updateStatus = 500;
                            res.updateMessage = "שגיאה בעדכון שלב הפרויקטים הקיימים";
                            return next();
                        }

                        db_pool.query(
                            `UPDATE stages SET title = ?, position = ? WHERE id = ?`,
                            [title.trim(), newPos, stageId],
                            (err3) => {
                                if (err3) {
                                    res.updateStatus = 500;
                                    res.updateMessage = "שגיאה בעדכון השלב";
                                } else {
                                    res.updateStatus = 200;
                                    res.updateMessage = "השלב עודכן בהצלחה";
                                }
                                next();
                            }
                        );
                    });
                });
            }
        );

    } catch (err) {
        res.updateStatus = 500;
        res.updateMessage = "שגיאה פנימית";
        next();
    }
}

//role admin only//
async function deleteStage(req, res, next) {
    const { stageId } = req.params;
    const userId = req.user.id;
    const type = req.user.role;
    const userDepartment = req.user.department_id;

    try {
        const accessInfo = await middleRole.checkUserStageActionAccess(userId, type, userDepartment);

        if (!accessInfo.hasAccess || !accessInfo.isAdmin) {
            res.deleteStatus = 403;
            res.deleteMessage = "אין לך הרשאה למחוק שלב במגמה זו";
            return next();
        }

        db_pool.query(
            `SELECT position FROM stages WHERE id = ? AND department_id = ?`,
            [stageId, userDepartment],
            (err, rows) => {
                if (err) {
                    res.deleteStatus = 500;
                    res.deleteMessage = "שגיאה בבדיקת ההרשאה";
                    return next();
                }
                if (rows.length === 0) {
                    res.deleteStatus = 403;
                    res.deleteMessage = "אין לך גישה למחוק שלב זה";
                    return next();
                }

                const deletedPos = rows[0].position;

                db_pool.query(`DELETE FROM stages WHERE id = ?`, [stageId], (err2) => {
                    if (err2) {
                        res.deleteStatus = 500;
                        res.deleteMessage = "שגיאה במחיקת השלב";
                        return next();
                    }

                    db_pool.query(
                        `UPDATE stages SET position = position - 1 WHERE department_id = ? AND position > ?`,
                        [userDepartment, deletedPos],
                        (err3) => {
                            if (err3) {
                                res.deleteStatus = 500;
                                res.deleteMessage = "שגיאה בעדכון סדר השלבים";
                                return next();
                            }

                            db_pool.query(
                                `UPDATE projects SET stage_count = stage_count - 1 WHERE department_id = ? AND stage_count > ?`,
                                [userDepartment, deletedPos],
                                (errProj) => {
                                    if (errProj) {
                                        res.deleteStatus = 500;
                                        res.deleteMessage = "שגיאה בעדכון שלב הפרויקטים הקיימים";
                                    } else {
                                        res.deleteStatus = 200;
                                        res.deleteMessage = "השלב נמחק בהצלחה";
                                    }
                                    next();
                                }
                            );
                        }
                    );
                });
            }
        );
    } catch (err) {
        res.deleteStatus = 500;
        res.deleteMessage = "שגיאה פנימית";
        next();
    }
}

//role instructor and student//
async function getProjectStages(req, res, next) {
    const { projectId } = req.params;
    const userId = req.user.id;
    const type = req.user.role;
    const userDepartment = req.user.department_id;

    try {
        const accessInfo = await middleRole.checkUserStageAccess(userId, type, userDepartment);

        if (!accessInfo.hasAccess) {
            res.getStatus = 403;
            res.getMessage = "אין לך הרשאה לצפות בשלבים של פרויקט זה";
            res.allStages = [];
            res.currentStage = null;
            return next();
        }

        const [projects] = await db_pool.promise().query(
            `SELECT stage_count FROM projects WHERE id = ? AND department_id = ?`,
            [projectId, userDepartment]
        );

        if (projects.length === 0) {
            res.getStatus = 404;
            res.getMessage = "פרויקט לא נמצא במגמה שלך";
            res.allStages = [];
            res.currentStage = null;
            return next();
        }

        const currentStageNumber = projects[0].stage_count;

        const [stages] = await db_pool.promise().query(
            `SELECT * FROM stages WHERE department_id = ? ORDER BY position ASC`,
            [userDepartment]
        );

        const currentStage = stages.find(s => s.position === currentStageNumber) || null;

        res.data = {
            allStages: stages,
            currentStage: currentStage
        };
        res.getStatus = 200;
        res.getMessage = "שלבים נשלפו בהצלחה";
        next();

    } catch (err) {
        res.getStatus = 500;
        res.getMessage = "שגיאה פנימית בשליפת השלבים";
        res.allStages = [];
        res.currentStage = null;
        next();
    }
}

//role instructor only//
async function updateProjectStage(req, res, next) {
    const { projectId } = req.params;
    const { stage } = req.body;
    const userId = req.user.id;
    const userType = req.user.role;
    const userDepartment = req.user.department_id;

    if (!stage || isNaN(stage) || stage < 1) {
        res.updateStatus = 400;
        res.updateMessage = "יש להזין מספר שלב תקין";
        return next();
    }

    try {
        const accessInfo = await middleRole.checkUserStageUpdateAccess(userId, userType, userDepartment, { projectId });

        if (!accessInfo.hasAccess) {
            res.updateStatus = 403;
            res.updateMessage = "אין לך הרשאה לעדכן שלב בפרויקט זה";
            return next();
        }

        db_pool.query(
            `UPDATE projects SET stage_count = ? WHERE id = ?`,
            [stage, projectId],
            async (err) => {
                if (err) {
                    res.updateStatus = 500;
                    res.updateMessage = "שגיאה בעדכון שלב הפרויקט";
                    return next();
                }

                db_pool.query(
                    `SELECT p.title AS project_title, p.student_id1, p.department_id, s.title AS stage_title
                     FROM projects p
                     LEFT JOIN stages s
                       ON s.position = ? AND s.department_id = p.department_id
                     WHERE p.id = ?`,
                    [stage, projectId],
                    async (err, results) => {
                        if (err || results.length === 0) {
                            console.error("שגיאה בשליפת שם הפרויקט או השלב:", err);
                        } else {
                            const project = results[0];
                            const projectName = project.project_title;
                            const stageName = project.stage_title;

                            if (project.student_id1) {
                                await addNotification(
                                    project.student_id1,
                                    'student',
                                    'שלב פרויקט עודכן',
                                    `הפרויקט "${projectName}" עודכן לשלב: "${stageName}".`,
                                    'system',
                                    projectId
                                ).catch(err => console.error('שגיאה בשליחת התראה לסטודנט:', err));
                            }

                            db_pool.query(
                                `SELECT id FROM instructor WHERE department_id = ? AND is_admin = 1`,
                                [project.department_id],
                                async (err, instructors) => {
                                    if (err) {
                                        console.error("שגיאה בשליפת מנהל המגמה:", err);
                                    } else {
                                        for (const inst of instructors) {
                                            await addNotification(
                                                inst.id,
                                                'instructor',
                                                'שלב פרויקט עודכן',
                                                `הפרויקט "${projectName}" עודכן לשלב: "${stageName}".`,
                                                'system',
                                                projectId
                                            ).catch(err => console.error('שגיאה בשליחת התראה למנהל המגמה:', err));
                                        }
                                    }
                                }
                            );
                        }
                    }
                );

                res.updateStatus = 200;
                res.updateMessage = "שלב הפרויקט עודכן בהצלחה";
                next();
            }
        );

    } catch (err) {
        res.updateStatus = 500;
        res.updateMessage = "שגיאה פנימית בעדכון שלב הפרויקט";
        next();
    }
}

//role instructor only//
async function approveDocument(req, res, next) {
    const { projectId } = req.params;
    const { id: userId, role: userRole, department_id: userDepartment } = req.user;

    try {
        const accessInfo = await middleRole.checkUserStageUpdateAccess(
            userId,
            userRole,
            userDepartment,
            { projectId }
        );

        if (!accessInfo.hasAccess) {
            res.statusCode = 403;
            res.message = "אין לך הרשאה לעדכן שלב עבור פרויקט זה";
            return next();
        }

        const [updateResult] = await db_pool.promise().query(
            "UPDATE projects SET status = 1 WHERE id = ?",
            [projectId]
        );

        if (updateResult.affectedRows === 0) {
            res.statusCode = 404;
            res.message = "פרויקט לא נמצא";
            return next();
        }

        const [projects] = await db_pool.promise().query(
            "SELECT title, student_id1, department_id FROM projects WHERE id = ?",
            [projectId]
        );

        if (projects.length === 0) {
            res.statusCode = 404;
            res.message = "פרויקט לא נמצא";
            return next();
        }

        const project = projects[0];
        const projectName = project.title;

        if (project.student_id1) {
            try {
                await addNotification(
                    project.student_id1,
                    'student',
                    'הפרויקט בשלב סופי',
                    `הפרויקט "${projectName}" הגיע לשלב הסופי. כעת ניתן להעלות מסמך Word ודוגמת חתימה.`,
                    'system',
                    projectId
                );
            } catch (err) {
                console.error('שגיאה בשליחת התראה לסטודנט:', err);
            }
        }

        const [admins] = await db_pool.promise().query(
            "SELECT id FROM instructor WHERE department_id = ? AND is_admin = 1",
            [project.department_id]
        );

        for (const inst of admins) {
            try {
                await addNotification(
                    inst.id,
                    'instructor',
                    'הפרויקט בשלב סופי',
                    `הפרויקט "${projectName}" הגיע לשלב הסופי. הסטודנט יכול להעלות מסמך Word ודוגמת חתימה.`,
                    'system',
                    projectId
                );
            } catch (err) {
                console.error(`שגיאה בשליחת התראה למנהל ${inst.id}:`, err);
            }
        }

        res.getStatus = 200;
        res.getMessage = "סטטוס הפרויקט עודכן והתראות נשלחו בהצלחה";
        next();

    } catch (err) {
        console.error("שגיאה פנימית באישור המסמך ושליחת התראות:", err);
        res.statusCode = 500;
        res.message = "שגיאה פנימית באישור המסמך ושליחת התראות";
        next();
    }
}


module.exports = {
    getStagesByDepartment,
    addStageByDepartment,
    updateStage,
    deleteStage,
    getProjectStages,
    updateProjectStage,
    approveDocument
};
