async function getComments(req, res, next) {
    const q = `SELECT * FROM comments`;
    db_pool.query(q, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "שגיאה בקבלת ההערות" });
        }
        res.commentsList = rows;
        next();
    });
}

async function getCommentsByProject(req, res, next) {
    const { projectId } = req.params;
    const userId = req.user.id;

    const checkQuery = `
        SELECT id 
        FROM projects 
        WHERE id = ? AND (
            student_id1 = ? OR 
            student_id2 = ? OR 
            instructor_id = ?
        )
    `;

    db_pool.query(checkQuery, [projectId, userId, userId, userId], (err, rows) => {
        if (err) {
            console.error('Error checking project access:', err);
            return res.status(500).json({ success: false, message: 'שגיאה בבדיקת הרשאות' });
        }

        if (rows.length === 0) {
            return res.status(403).json({ success: false, message: 'אין לך גישה להערות של פרויקט זה' });
        }

        const commentsQuery = `
            SELECT id, text, is_done, title, section, page, user_response, done_by_user
            FROM comments
            WHERE project_id = ?
        `;

        db_pool.query(commentsQuery, [projectId], (err2, comments) => {
            if (err2) {
                console.error("Error fetching comments:", err2);
                return res.status(500).json({ success: false, message: 'שגיאה בקבלת הערות עבור הפרויקט' });
            }

            const doneAndCompleted = [];
            const doneButNotCompleted = [];
            const notDone = [];

            comments.forEach(comment => {
                if (comment.is_done === 1 && comment.done_by_user !== 0 && comment.done_by_user !== null) {
                    doneAndCompleted.push(comment);
                } else if (comment.is_done === 0 && comment.done_by_user !== 0 && comment.done_by_user !== null) {
                    doneButNotCompleted.push(comment);
                } else if (comment.done_by_user === 0 || comment.done_by_user === null) {
                    notDone.push(comment);
                }
            });

            res.commentsList = {
                doneAndCompleted,
                doneButNotCompleted,
                notDone,
                doneAndCompletedCount: doneAndCompleted.length,
                doneButNotCompletedCount: doneButNotCompleted.length,
                notDoneCount: notDone.length,
            };

            next();
        });
    });
}

async function addComment(req, res, next) {
    const { project_id, title, section, page, text, is_done } = req.body;
    const userId = req.user.id;

    if (!project_id) {
        res.addStatus = 400;
        res.addMessage = "מזהה הפרויקט הוא שדה חובה";
        return next();
    }
    if (!title || title.trim() === "") {
        res.addStatus = 400;
        res.addMessage = "כותרת היא שדה חובה";
        return next();
    }
    if (!section || section.trim() === "") {
        res.addStatus = 400;
        res.addMessage = "מקטע הוא שדה חובה";
        return next();
    }
    if (page === undefined || page === null || isNaN(page)) {
        res.addStatus = 400;
        res.addMessage = "עמוד הוא שדה חובה וחייב להיות מספר";
        return next();
    }
    if (!text || text.trim() === "") {
        res.addStatus = 400;
        res.addMessage = "הטקסט של ההערה הוא שדה חובה";
        return next();
    }

    try {
        const checkQuery = `SELECT id FROM projects WHERE id = ? AND instructor_id = ?`;
        db_pool.query(checkQuery, [project_id, userId], (err, rows) => {
            if (err) {
                console.error("Error checking project access:", err);
                res.addStatus = 500;
                res.addMessage = "שגיאה בבדיקת הרשאות";
                return next();
            }

            if (rows.length === 0) {
                res.addStatus = 403;
                res.addMessage = "אין לך גישה להוסיף הערות לפרויקט זה";
                return next();
            }

            const insertQuery = `
                INSERT INTO comments (project_id, title, section, page, text, is_done)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            db_pool.query(
                insertQuery,
                [project_id, title, section, page, text, is_done || 0],
                (err2, result) => {
                    if (err2) {
                        console.error("Error inserting comment:", err2);
                        res.addStatus = 500;
                        res.addMessage = "שגיאה בהוספת ההערה";
                    } else {
                        res.addStatus = 200;
                        res.addMessage = "ההערה נוספה בהצלחה";
                    }
                    next();
                }
            );
        });
    } catch (error) {
        console.error("General error in addComment:", error);
        res.addStatus = 500;
        res.addMessage = "שגיאה כללית בהוספת ההערה";
        next();
    }
}

async function updateComment(req, res, next) {
    const { commentId } = req.params;
    const { title, section, page, text } = req.body;
    const userId = req.user.id;

    if (!title || title.trim() === "") {
        res.updateStatus = 400;
        res.updateMessage = "כותרת היא שדה חובה";
        return next();
    }
    if (!section || section.trim() === "") {
        res.updateStatus = 400;
        res.updateMessage = "מקטע הוא שדה חובה";
        return next();
    }
    if (page === undefined || page === null || isNaN(page)) {
        res.updateStatus = 400;
        res.updateMessage = "עמוד הוא שדה חובה וחייב להיות מספר";
        return next();
    }
    if (!text || text.trim() === "") {
        res.updateStatus = 400;
        res.updateMessage = "הטקסט של ההערה הוא שדה חובה";
        return next();
    }

    const selectQuery = `
        SELECT c.id
        FROM comments c
                 JOIN projects p ON c.project_id = p.id
        WHERE c.id = ? AND p.instructor_id = ?
            LIMIT 1
    `;
    db_pool.query(selectQuery, [commentId, userId], (err, results) => {
        if (err) {
            console.error("Error checking comment access:", err);
            res.updateStatus = 500;
            res.updateMessage = "שגיאה בבדיקת הרשאות";
            return next();
        }

        if (results.length === 0) {
            res.updateStatus = 403;
            res.updateMessage = "אין לך גישה לעדכן את ההערה הזו";
            return next();
        }

        const updateQuery = `
            UPDATE comments
            SET title = ?, section = ?, page = ?, text = ?
            WHERE id = ?
        `;
        db_pool.query(updateQuery, [title, section, page, text, commentId], (err2) => {
            if (err2) {
                console.error("Error updating comment:", err2);
                res.updateStatus = 500;
                res.updateMessage = "שגיאה בעדכון ההערה";
            } else {
                res.updateStatus = 200;
                res.updateMessage = "ההערה עודכנה בהצלחה";
            }
            next();
        });
    });
}

async function setCommentDone(req, res, next) {
    const { commentId } = req.params;
    const userId = req.user.id;

    const selectQuery = `
        SELECT c.id, c.done_by_user
        FROM comments c
        JOIN projects p ON c.project_id = p.id
        WHERE c.id = ? AND p.instructor_id = ?
        LIMIT 1
    `;
    db_pool.query(selectQuery, [commentId, userId], (err, results) => {
        if (err) {
            console.error("Error checking comment access:", err);
            res.updateStatus = 500;
            res.updateMessage = "שגיאה בבדיקת הרשאות";
            return next();
        }

        if (results.length === 0) {
            res.updateStatus = 403;
            res.updateMessage = "אין לך גישה לסמן את ההערה הזו כבוצעה";
            return next();
        }

        const comment = results[0];
        if (!comment.done_by_user) {
            res.updateStatus = 403;
            res.updateMessage = "המשתמש לא סימן את ההערה כבוצעה, לא ניתן לסמן כבוצע";
            return next();
        }

        const updateQuery = `UPDATE comments SET is_done = 1 WHERE id = ?`;
        db_pool.query(updateQuery, [commentId], (err2) => {
            if (err2) {
                console.error("Error marking comment as done:", err2);
                res.updateStatus = 500;
                res.updateMessage = "שגיאה בסימון ההערה כבוצעה";
            } else {
                res.updateStatus = 200;
                res.updateMessage = "ההערה סומנה כבוצעה בהצלחה";
            }
            next();
        });
    });
}

async function markDoneByUser(req, res, next) {
    const { commentId } = req.params;
    const { user_response } = req.body;
    const userId = req.user.id;

    if (!user_response || user_response.trim() === "") {
        res.updateStatus = 400;
        res.updateMessage = "תגובה היא שדה חובה";
        return next();
    }

    const selectQuery = `
        SELECT c.id, c.done_by_user, c.user_response
        FROM comments c
        JOIN projects p ON c.project_id = p.id
        WHERE c.id = ? AND (p.student_id1 = ? OR p.student_id2 = ?)
        LIMIT 1
    `;
    db_pool.query(selectQuery, [commentId, userId, userId], (err, results) => {
        if (err) {
            console.error("Error checking comment access:", err);
            res.updateStatus = 500;
            res.updateMessage = "שגיאה בבדיקת הרשאות";
            return next();
        }

        if (results.length === 0) {
            res.updateStatus = 403;
            res.updateMessage = "אין לך גישה לעדכן את ההערה הזו";
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
}

async function deleteComment(req, res, next) {
    const { commentId } = req.params;
    const userId = req.user.id;

    const selectQuery = `
        SELECT c.id
        FROM comments c
        JOIN projects p ON c.project_id = p.id
        WHERE c.id = ? AND p.instructor_id = ?
        LIMIT 1
    `;
    db_pool.query(selectQuery, [commentId, userId], (err, results) => {
        if (err) {
            console.error("Error checking comment access:", err);
            res.deleteStatus = 500;
            res.deleteMessage = "שגיאה בבדיקת הרשאות";
            return next();
        }

        if (results.length === 0) {
            res.deleteStatus = 403;
            res.deleteMessage = "אין לך גישה למחוק את ההערה הזו";
            return next();
        }

        const deleteQuery = `DELETE FROM comments WHERE id = ?`;
        db_pool.query(deleteQuery, [commentId], (err2) => {
            if (err2) {
                console.error("Error deleting comment:", err2);
                res.deleteStatus = 500;
                res.deleteMessage = "שגיאה במחיקת ההערה";
            } else {
                res.deleteStatus = 200;
                res.deleteMessage = "ההערה נמחקה בהצלחה";
            }
            next();
        });
    });
}

async function getCommentById(req, res, next) {
    const { commentId } = req.params;
    const userId = req.user.id;

    if (!commentId || isNaN(commentId)) {
        res.getStatus = 400;
        res.getMessage = "מזהה ההערה אינו תקין";
        return next();
    }

    const query = `
        SELECT c.*
        FROM comments c
                 JOIN projects p ON c.project_id = p.id
        WHERE c.id = ?
          AND (p.instructor_id = ? OR p.student_id1 = ? OR p.student_id2 = ?)
            LIMIT 1
    `;

    db_pool.query(query, [commentId, userId, userId, userId], (err, results) => {
        if (err) {
            console.error("Error fetching comment:", err);
            res.getStatus = 500;
            res.getMessage = "שגיאה בקבלת ההערה";
            return next();
        }

        if (results.length === 0) {
            res.getStatus = 403;
            res.getMessage = "אין לך גישה להערה הזו";
            return next();
        }

        res.getStatus = 200;
        res.commentData = results[0];
        next();
    });
}

async function getNextComment(req, res, next) {
    const { commentId } = req.params;
    const currentId = parseInt(commentId, 10);
    const userId = req.user.id;

    if (isNaN(currentId)) {
        req.nextStatus = 400;
        req.nextMessage = "מזהה ההערה אינו תקין";
        req.nextSuccess = false;
        return next();
    }

    try {
        const currentComment = await getCommentByIdFromDb(currentId, userId);
        if (!currentComment) {
            req.nextStatus = 403;
            req.nextMessage = "אין לך גישה להערה הזו";
            req.nextSuccess = false;
            return next();
        }

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
                console.error("שגיאה ב-SQL:", err);
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
        console.error("שגיאה בתהליך:", err);
        req.nextStatus = 500;
        req.nextMessage = "שגיאה בשרת";
        req.nextSuccess = false;
        next();
    }
}

async function getPrevComment(req, res, next) {
    const { commentId } = req.params;
    const currentId = parseInt(commentId, 10);
    const userId = req.user.id;

    if (isNaN(currentId)) {
        req.prevStatus = 400;
        req.prevMessage = "מזהה ההערה אינו תקין";
        req.prevSuccess = false;
        return next();
    }

    try {
        const currentComment = await getCommentByIdFromDb(currentId, userId);
        if (!currentComment) {
            req.prevStatus = 403;
            req.prevMessage = "אין לך גישה להערה הזו";
            req.prevSuccess = false;
            return next();
        }

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
                console.error("שגיאה ב-SQL:", err);
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
        console.error("שגיאה בתהליך:", err);
        req.prevStatus = 500;
        req.prevMessage = "שגיאה בשרת";
        req.prevSuccess = false;
        next();
    }
}


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
    getComments,
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


