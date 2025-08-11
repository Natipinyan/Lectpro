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
    const q = `SELECT * FROM comments WHERE project_id = ?`;
    db_pool.query(q, [projectId], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "שגיאה בקבלת ההערות עבור הפרויקט" });
        }
        res.commentsList = rows;
        next();
    });
}

async function addComment(req, res, next) {
    const { project_id, title, section, page, text, is_done } = req.body;

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
        const insertQuery = `
            INSERT INTO comments (project_id, title, section, page, text, is_done)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db_pool.query(
            insertQuery,
            [project_id, title, section, page, text, is_done || 0],
            (err, result) => {
                if (err) {
                    res.addStatus = 500;
                    res.addMessage = "שגיאה בהוספת ההערה";
                } else {
                    res.addStatus = 200;
                    res.addMessage = "ההערה נוספה בהצלחה";
                }
                next();
            }
        );
    } catch (error) {
        res.addStatus = 500;
        res.addMessage = "שגיאה כללית בהוספת ההערה";
        next();
    }
}

async function updateComment(req, res, next) {
    const { commentId } = req.params;
    const { title, section, page, text, is_done } = req.body;

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

    const selectQuery = `SELECT id FROM comments WHERE id = ? LIMIT 1`;
    db_pool.query(selectQuery, [commentId], (err, results) => {
        if (err || results.length === 0) {
            res.updateStatus = 404;
            res.updateMessage = "ההערה לא נמצאה";
            return next();
        }

        const updateQuery = `
            UPDATE comments
            SET title = ?, section = ?, page = ?, text = ?, is_done = ?
            WHERE id = ?
        `;
        db_pool.query(
            updateQuery,
            [title, section, page, text, is_done, commentId],
            (err2) => {
                if (err2) {
                    res.updateStatus = 500;
                    res.updateMessage = "שגיאה בעדכון ההערה";
                } else {
                    res.updateStatus = 200;
                    res.updateMessage = "ההערה עודכנה בהצלחה";
                }
                next();
            }
        );
    });
}

async function deleteComment(req, res, next) {
    const { commentId } = req.params;

    const selectQuery = `SELECT id FROM comments WHERE id = ? LIMIT 1`;
    db_pool.query(selectQuery, [commentId], (err, results) => {
        if (err || results.length === 0) {
            res.deleteStatus = 404;
            res.deleteMessage = "ההערה לא נמצאה";
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
    });
}

module.exports = {
    getComments,
    getCommentsByProject,
    addComment,
    updateComment,
    deleteComment
};