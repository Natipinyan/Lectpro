async function getStages(req, res, next) {
    const userDepartment = req.user.department_id;
    const query = `SELECT * FROM stages WHERE department_id = ? ORDER BY position ASC`;
    db_pool.query(query, [userDepartment], (err, rows) => {
        if (err) {
            console.error("Error fetching stages:", err);
            res.stagesList = [];
            res.errorMessage = "שגיאה בקבלת השלבים";
        } else {
            res.stagesList = rows;
        }
        next();
    });
}

async function addStage(req, res, next) {
    const { title, position } = req.body;
    const userDepartment = req.user.department_id;

    if (!title || title.trim() === "") {
        res.addStatus = 400;
        res.addMessage = "שדה הכותרת חובה";
        return next();
    }

    db_pool.query(
        `SELECT MAX(position) AS maxPos, COUNT(*) AS stageCount FROM stages WHERE department_id = ?`,
        [userDepartment],
        (err, rows) => {
            if (err) {
                res.addStatus = 500;
                res.addMessage = "שגיאה בבדיקת מיקום השלבים";
                return next();
            }

            const maxPos = (rows[0].maxPos === null) ? 0 : rows[0].maxPos;
            const stageCount = rows[0].stageCount;

            let newPos = parseInt(position);

            if (isNaN(newPos) || newPos < 1) {
                newPos = 1;
            } else if (newPos > maxPos + 1) {
                newPos = maxPos + 1;
            }

            db_pool.query(
                `UPDATE stages SET position = position + 1 WHERE department_id = ? AND position >= ?`,
                [userDepartment, newPos],
                (err2) => {
                    if (err2) {
                        res.addStatus = 500;
                        res.addMessage = "שגיאה בהזזת השלבים";
                        return next();
                    }

                    db_pool.query(
                        `INSERT INTO stages (title, department_id, position) VALUES (?, ?, ?)`,
                        [title.trim(), userDepartment, newPos],
                        (err3) => {
                            if (err3) {
                                res.addStatus = 500;
                                res.addMessage = "שגיאה בהוספת השלב";
                            } else {
                                res.addStatus = 200;
                                res.addMessage = "השלב נוסף בהצלחה";
                            }
                            next();
                        }
                    );
                }
            );
        }
    );
}

async function updateStage(req, res, next) {
    const { stageId } = req.params;
    const { title, position } = req.body;
    const userDepartment = req.user.department_id;

    if (!title || title.trim() === "") {
        res.updateStatus = 400;
        res.updateMessage = "כותרת היא שדה חובה";
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

            let updateQuery, updateParams;

            if (newPos < oldPos) {
                updateQuery = `
                    UPDATE stages
                    SET position = position + 1
                    WHERE department_id = ? AND position >= ? AND position < ?;
                `;
                updateParams = [userDepartment, newPos, oldPos];
            } else {
                updateQuery = `
                    UPDATE stages
                    SET position = position - 1
                    WHERE department_id = ? AND position > ? AND position <= ?;
                `;
                updateParams = [userDepartment, oldPos, newPos];
            }

            db_pool.query(updateQuery, updateParams, (err2) => {
                if (err2) {
                    console.error(`[updateStage] Error adjusting positions: ${err2.message}`);
                    res.updateStatus = 500;
                    res.updateMessage = "שגיאה בעדכון סדר השלבים";
                    return next();
                }

                db_pool.query(
                    `UPDATE stages SET title = ?, position = ? WHERE id = ?`,
                    [title.trim(), newPos, stageId],
                    (err3) => {
                        if (err3) {
                            console.error(`[updateStage] Error updating stage: ${err3.message}`);
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
        }
    );
}

async function deleteStage(req, res, next) {
    const { stageId } = req.params;
    const userDepartment = req.user.department_id;

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
                        } else {
                            res.deleteStatus = 200;
                            res.deleteMessage = "השלב נמחק בהצלחה";
                        }
                        next();
                    }
                );
            });
        }
    );
}

module.exports = {
    getStages,
    addStage,
    updateStage,
    deleteStage
};
