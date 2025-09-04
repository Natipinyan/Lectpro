const middleRole = require('../role');

//role for student instructor admin//
async function getCommentsByProject(req, res, next) {
    const { projectId } = req.params;
    const userId = req.user?.id;
    const type = req.user?.role;



    if (!projectId || isNaN(projectId)) {
        res.getStatus = 400;
        res.getMessage = "מזהה פרויקט לא תקין";
        return next();
    }

    if (!userId) {
        res.getStatus = 401;
        res.getMessage = "נדרש להתחבר";
        return next();
    }

    try {
        const accessInfo = await middleRole.checkUserProjectAccess(userId, type, projectId);

        if (!accessInfo.hasAccess) {
            res.getStatus = 403;
            res.getMessage = "אין לך גישה להערות של פרויקט זה";
            return next();
        }

        const commentsQuery = `
            SELECT id, text, is_done, title, section, page, user_response, done_by_user
            FROM comments
            WHERE project_id = ?
        `;

        db_pool.query(commentsQuery, [projectId], (err, comments) => {
            if (err) {
                res.getStatus = 500;
                res.getMessage = "שגיאה בקבלת הערות עבור הפרויקט";
                return next();
            }

            const doneAndCompleted = [];
            const doneButNotCompleted = [];
            const notDone = [];

            comments.forEach(comment => {
                if (comment.is_done === 1 && comment.done_by_user) {
                    doneAndCompleted.push(comment);
                } else if (comment.is_done === 0 && comment.done_by_user) {
                    doneButNotCompleted.push(comment);
                } else {
                    notDone.push(comment);
                }
            });

            res.getStatus = 200;
            res.data = {
                doneAndCompleted,
                doneButNotCompleted,
                notDone,
                doneAndCompletedCount: doneAndCompleted.length,
                doneButNotCompletedCount: doneButNotCompleted.length,
                notDoneCount: notDone.length
            };
            next();
        });

    } catch (err) {
        res.getStatus = 500;
        res.getMessage = "שגיאה בבדיקת הרשאות";
        next();
    }
}

//role for student instructor admin//
async function getCommentById(req, res, next) {
    const { commentId } = req.params;
    const userId = req.user?.id;
    const type = req.user?.role;

    if (!commentId || isNaN(commentId)) {
        res.getStatus = 400;
        res.getMessage = "מזהה ההערה אינו תקין";
        return next();
    }

    if (!userId) {
        res.getStatus = 401;
        res.getMessage = "נדרש להתחבר";
        return next();
    }

    try {
        const accessInfo = await middleRole.checkUserCommentAccess(userId, type, commentId);

        if (!accessInfo.hasAccess) {
            res.getStatus = 403;
            res.getMessage = "אין לך גישה להערה הזו";
            return next();
        }

        const comment = await getCommentByIdFromDb(commentId);

        if (!comment) {
            res.getStatus = 404;
            res.getMessage = "לא נמצאה הערה";
            return next();
        }

        res.getStatus = 200;
        res.data = comment;
        next();

    } catch (err) {
        res.getStatus = 500;
        res.getMessage = "שגיאה בקבלת ההערה";
        next();
    }
}

//role for student instructor admin//
async function getNextComment(req, res, next) {
    const { commentId } = req.params;
    const currentId = parseInt(commentId, 10);
    const userId = req.user.id;
    const type = req.user.role;

    if (isNaN(currentId)) {
        req.nextStatus = 400;
        req.nextMessage = "מזהה ההערה אינו תקין";
        req.nextSuccess = false;
        return next();
    }

    try {
        const accessInfo = await middleRole.checkUserCommentAccess(userId, type, currentId);
        if (!accessInfo.hasAccess) {
            req.nextStatus = 403;
            req.nextMessage = "אין לך גישה להערה הזו";
            req.nextSuccess = false;
            return next();
        }

        const currentComment = await getCommentByIdFromDb(currentId);
        const projectId = currentComment.project_id;

        const query = `
            SELECT c.*
            FROM comments c
            WHERE c.id > ? AND c.project_id = ?
            ORDER BY c.id ASC
            LIMIT 1
        `;

        db_pool.query(query, [currentId, projectId], (err, results) => {
            if (err) {
                req.nextStatus = 500;
                req.nextMessage = "שגיאה בקבלת ההערה הבאה";
                req.nextSuccess = false;
                return next();
            }

            if (results.length === 0) {
                req.nextStatus = 200;
                req.nextMessage = "אין הערה הבאה בפרויקט הנוכחי";
                req.nextComment = null;
                req.nextSuccess = false;
            } else {
                req.nextStatus = 200;
                req.nextMessage = "הערה הבאה התקבלה בהצלחה";
                req.nextComment = results[0];
                req.nextSuccess = true;
            }
            next();
        });
    } catch (err) {
        req.nextStatus = 500;
        req.nextMessage = "שגיאה בשרת";
        req.nextSuccess = false;
        next();
    }
}

//role for student instructor admin//
async function getPrevComment(req, res, next) {
    const { commentId } = req.params;
    const currentId = parseInt(commentId, 10);
    const userId = req.user.id;
    const type = req.user.role;


    if (isNaN(currentId)) {
        req.prevStatus = 400;
        req.prevMessage = "מזהה ההערה אינו תקין";
        req.prevSuccess = false;
        return next();
    }

    try {
        const accessInfo = await middleRole.checkUserCommentAccess(userId, type, currentId);
        if (!accessInfo.hasAccess) {
            req.prevStatus = 403;
            req.prevMessage = "אין לך גישה להערה הזו";
            req.prevSuccess = false;
            return next();
        }

        const currentComment = await getCommentByIdFromDb(currentId);
        const projectId = currentComment.project_id;

        const query = `
            SELECT c.*
            FROM comments c
            WHERE c.id < ? AND c.project_id = ?
            ORDER BY c.id DESC
            LIMIT 1
        `;

        db_pool.query(query, [currentId, projectId], (err, results) => {
            if (err) {
                req.prevStatus = 500;
                req.prevMessage = "שגיאה בקבלת ההערה הקודמת";
                req.prevSuccess = false;
                return next();
            }

            if (results.length === 0) {
                req.prevStatus = 200;
                req.prevMessage = "אין הערה קודמת בפרויקט הנוכחי";
                req.prevComment = null;
                req.prevSuccess = false;
            } else {
                req.prevStatus = 200;
                req.prevMessage = "הערה הקודמת התקבלה בהצלחה";
                req.prevComment = results[0];
                req.prevSuccess = true;
            }
            next();
        });
    } catch (err) {
        req.prevStatus = 500;
        req.prevMessage = "שגיאה בשרת";
        req.prevSuccess = false;
        next();
    }
}

//role instructor only//
async function addComment(req, res, next) {
    const { project_id, title, section, page, text, is_done } = req.body;
    const userId = req.user.id;
    const type = req.user.role;

    if (!project_id) {
        res.getStatus = 400;
        res.getMessage = "מזהה הפרויקט הוא שדה חובה";
        return next();
    }
    if (!title || title.trim() === "") {
        res.getStatus = 400;
        res.getMessage = "כותרת היא שדה חובה";
        return next();
    }
    if (!section || section.trim() === "") {
        res.getStatus = 400;
        res.getMessage = "מקטע הוא שדה חובה";
        return next();
    }
    if (page === undefined || page === null || isNaN(page)) {
        res.getStatus = 400;
        res.getMessage = "עמוד הוא שדה חובה וחייב להיות מספר";
        return next();
    }
    if (!text || text.trim() === "") {
        res.getStatus = 400;
        res.getMessage = "הטקסט של ההערה הוא שדה חובה";
        return next();
    }

    try {
        const accessInfo = await middleRole.checkUserCommentActionAccess(userId, type, { projectId: project_id });

        if (accessInfo.role !== "instructor" || !accessInfo.hasAccess) {
            res.getStatus = 403;
            res.getMessage = "אין לך הרשאה להוסיף הערה לפרויקט הזה";
            return next();
        }

        const insertQuery = `
            INSERT INTO comments (project_id, title, section, page, text, is_done)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db_pool.query(
            insertQuery,
            [project_id, title, section, page, text, is_done || 0],
            (err, result) => {
                if (err) {
                    res.getStatus = 500;
                    res.getMessage = "שגיאה בהוספת ההערה";
                } else {
                    res.getStatus = 200;
                    res.getMessage = "ההערה נוספה בהצלחה";
                }
                next();
            }
        );
    } catch (err) {
        res.getStatus = 500;
        res.getMessage = "שגיאה כללית בהוספת ההערה";
        next();
    }
}

//role instructor only//
async function updateComment(req, res, next) {
    const { commentId } = req.params;
    const { title, section, page, text } = req.body;
    const userId = req.user.id;
    const type = req.user.role;

    if (!title || title.trim() === "") {
        res.getStatus = 400;
        res.getMessage = "כותרת היא שדה חובה";
        return next();
    }
    if (!section || section.trim() === "") {
        res.getStatus = 400;
        res.getMessage = "מקטע הוא שדה חובה";
        return next();
    }
    if (page === undefined || page === null || isNaN(page)) {
        res.getStatus = 400;
        res.getMessage = "עמוד הוא שדה חובה וחייב להיות מספר";
        return next();
    }
    if (!text || text.trim() === "") {
        res.getStatus = 400;
        res.getMessage = "הטקסט של ההערה הוא שדה חובה";
        return next();
    }

    try {
        const accessInfo = await middleRole.checkUserCommentActionAccess(userId, type, {commentId});
        if (accessInfo.role !== "instructor" || !accessInfo.hasAccess) {
            res.getStatus = 403;
            res.getMessage = "אין לך הרשאה לעדכן את ההערה הזו";
            return next();
        }

        const updateQuery = `
            UPDATE comments
            SET title = ?, section = ?, page = ?, text = ?
            WHERE id = ?
        `;

        db_pool.query(updateQuery, [title, section, page, text, commentId], (err) => {
            if (err) {
                res.getStatus = 500;
                res.getMessage = "שגיאה בעדכון ההערה";
            } else {
                res.getStatus = 200;
                res.getMessage = "ההערה עודכנה בהצלחה";
            }
            next();
        });
    } catch (err) {
        res.getStatus = 500;
        res.getMessage = "שגיאה כללית בעדכון ההערה";
        next();
    }
}

//role instructor only//
async function setCommentDone(req, res, next) {
    const { commentId } = req.params;
    const userId = req.user.id;
    const type = req.user.role;

    try {
        const accessInfo = await middleRole.checkUserCommentActionAccess(userId, type, {commentId});
        if (!accessInfo.hasAccess) {
            res.updateStatus = 403;
            res.updateMessage = "אין לך הרשאה לסמן את ההערה הזו כבוצעה";
            return next();
        }

        const selectQuery = `SELECT is_done FROM comments WHERE id = ?`;
        db_pool.query(selectQuery, [commentId], (err, results) => {
            if (err) {
                res.updateStatus = 500;
                res.updateMessage = "שגיאה בבדיקת ההערה";
                return next();
            }

            if (results.length === 0) {
                res.updateStatus = 404;
                res.updateMessage = "הערה לא נמצאה";
                return next();
            }

            const comment = results[0];
            if (comment.is_done) {
                res.updateStatus = 400;
                res.updateMessage = "ההערה כבר מסומנת כבוצעה";
                return next();
            }

            const updateQuery = `UPDATE comments SET is_done = 1 WHERE id = ?`;
            db_pool.query(updateQuery, [commentId], (err2) => {
                if (err2) {
                    res.updateStatus = 500;
                    res.updateMessage = "שגיאה בסימון ההערה כבוצעה";
                } else {
                    res.updateStatus = 200;
                    res.updateMessage = "ההערה סומנה כבוצעה בהצלחה";
                }
                next();
            });
        });
    } catch (err) {
        res.updateStatus = 500;
        res.updateMessage = "שגיאה כללית בשרת";
        next();
    }
}

//role student only//
async function markDoneByUser(req, res, next) {
    const { commentId } = req.params;
    const { user_response } = req.body;
    const userId = req.user.id;
    const type = req.user.role;

    if (!user_response || user_response.trim() === "") {
        res.updateStatus = 400;
        res.updateMessage = "תגובה היא שדה חובה";
        return next();
    }

    try {
        const accessInfo = await middleRole.checkUserCommentAccess(userId, type, commentId);
        if (!accessInfo.hasAccess) {
            res.updateStatus = 403;
            res.updateMessage = "אין לך הרשאה לעדכן את ההערה הזו";
            return next();
        }

        const selectQuery = `SELECT done_by_user, user_response FROM comments WHERE id = ?`;
        db_pool.query(selectQuery, [commentId], (err, results) => {
            if (err) {
                res.updateStatus = 500;
                res.updateMessage = "שגיאה בבדיקת ההערה";
                return next();
            }

            if (results.length === 0) {
                res.updateStatus = 404;
                res.updateMessage = "הערה לא נמצאה";
                return next();
            }

            const comment = results[0];
            if (comment.done_by_user === 1 || (comment.user_response && comment.user_response.trim() !== "")) {
                res.updateStatus = 400;
                res.updateMessage = "ההערה כבר טופלה";
                return next();
            }

            const updateQuery = `
                UPDATE comments
                SET done_by_user = 1, user_response = ?
                WHERE id = ?
            `;
            db_pool.query(updateQuery, [user_response.trim(), commentId], (err2) => {
                if (err2) {
                    res.updateStatus = 500;
                    res.updateMessage = "שגיאה בעדכון תגובת המשתמש";
                } else {
                    res.updateStatus = 200;
                    res.updateMessage = "התגובה נקלטה בהצלחה";
                }
                next();
            });
        });
    } catch (err) {
        res.updateStatus = 500;
        res.updateMessage = "שגיאה כללית בשרת";
        next();
    }
}

//role instructor only//
async function deleteComment(req, res, next) {
    const { commentId } = req.params;
    const userId = req.user.id;
    const type = req.user.role;

    try {
        const accessInfo = await middleRole.checkUserCommentActionAccess(userId, type, {commentId});
        if (!accessInfo.hasAccess) {
            res.deleteStatus = 403;
            res.deleteMessage = "אין לך הרשאה למחוק את ההערה הזו";
            return next();
        }

        const deleteQuery = `DELETE FROM comments WHERE id = ?`;
        db_pool.query(deleteQuery, [commentId], (err2) => {
            if (err2) {
                res.deleteStatus = 500;
                res.deleteMessage = "שגיאה במחיקת ההערה";
            } else {
                res.deleteStatus = 200;
                res.deleteMessage = "ההערה נמחקה בהצלחה";
            }
            next();
        });
    } catch (err) {
        res.deleteStatus = 500;
        res.deleteMessage = "שגיאה כללית בשרת";
        next();
    }
}

//helper function to get comment by ID from DB
function getCommentByIdFromDb(commentId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM comments WHERE id = ?';
        db_pool.query(query, [commentId], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results.length > 0 ? results[0] : null);
        });
    });
}


module.exports = {
    getCommentsByProject,
    addComment,
    updateComment,
    deleteComment,
    setCommentDone,
    markDoneByUser,
    getCommentById,
    getNextComment,
    getPrevComment
};


