async function getTechnologies(req, res, next) {
    const q = `SELECT * FROM technology_in_use`;
    db_pool.query(q, function (err, rows) {
        if (err) {
            return res.status(500).json({ message: "שגיאה בקבלת טכנולוגיות" });
        }
        res.technologyList = rows;
        next();
    });
}

async function getTechnologiesAdmin(req, res, next) {
    const q = `SELECT * FROM technology_in_use`;
    db_pool.query(q, function (err, rows) {
        if (err) {
            return res.status(500).json({ message: "שגיאה בקבלת טכנולוגיות" });
        }
        res.technologyList = rows;
        next();
    });
}

async function addTechnology(req, res, next) {
    const { technologyName, technologyTitle } = req.body;

    if (!technologyName || !technologyTitle) {
        res.addStatus = 400;
        res.addMessage = "שם וסוג הטכנולוגיה הם שדות חובה";
        return next();
    }

    try {
        const checkQuery = `SELECT * FROM technology_in_use WHERE language = ?`;
        db_pool.query(checkQuery, [technologyName], (err, results) => {
            if (err) {
                res.addStatus = 500;
                res.addMessage = "שגיאה בחיבור למסד הנתונים";
                return next();
            }

            if (results.length > 0) {
                res.addStatus = 400;
                res.addMessage = "טכנולוגיה עם שם זה כבר קיימת";
                return next();
            }

            const insertQuery = `INSERT INTO technology_in_use (title, language) VALUES (?, ?)`;
            db_pool.query(insertQuery, [technologyTitle, technologyName], (err, result) => {
                if (err) {
                    res.addStatus = 500;
                    res.addMessage = "שגיאה בהוספת טכנולוגיה";
                } else {
                    res.addStatus = 200;
                    res.addMessage = "הטכנולוגיה נוספה בהצלחה";
                }
                next();
            });
        });
    } catch (error) {
        res.addStatus = 500;
        res.addMessage = "שגיאה כללית בהוספת טכנולוגיה";
        next();
    }
}

async function updateTechnology(req, res, next) {
    const userId = req.user.id;
    const { technologyId } = req.params;
    const { title, language } = req.body;

    const checkAdminQuery = `SELECT is_admin FROM instructor WHERE id = ? LIMIT 1`;

    db_pool.query(checkAdminQuery, [userId], function (err, results) {
        if (err || results.length === 0) {
            res.updateStatus = 500;
            res.updateMessage = "שגיאה באימות המשתמש";
            return next();
        }

        if (!results[0].is_admin) {
            res.updateStatus = 403;
            res.updateMessage = "אין לך הרשאה לעדכן טכנולוגיות";
            return next();
        }

        const updateQuery = `UPDATE technology_in_use SET title = ?, language = ? WHERE id = ?`;

        db_pool.query(updateQuery, [title, language, technologyId], function (err2, result) {
            if (err2) {
                res.updateStatus = 500;
                res.updateMessage = "שגיאה בעדכון טכנולוגיה";
            } else if (result.affectedRows === 0) {
                res.updateStatus = 404;
                res.updateMessage = "הטכנולוגיה לא נמצאה";
            } else {
                res.updateStatus = 200;
                res.updateMessage = "הטכנולוגיה עודכנה בהצלחה";
            }
            next();
        });
    });
}

async function deleteTechnology(req, res, next) {
    const userId = req.user.id;
    const { technologyId } = req.params;

    const checkAdminQuery = `SELECT is_admin FROM instructor WHERE id = ? LIMIT 1`;

    db_pool.query(checkAdminQuery, [userId], function (err, results) {
        if (err || results.length === 0) {
            res.deleteStatus = 500;
            res.deleteMessage = "שגיאה באימות המשתמש";
            return next();
        }

        if (!results[0].is_admin) {
            res.deleteStatus = 403;
            res.deleteMessage = "אין לך הרשאה למחוק טכנולוגיות";
            return next();
        }

        const deleteQuery = `DELETE FROM technology_in_use WHERE id = ?`;

        db_pool.query(deleteQuery, [technologyId], function (err2, result) {
            if (err2) {
                if (err2.code === 'ER_ROW_IS_REFERENCED_2') {
                    res.deleteStatus = 400;
                    res.deleteMessage = "הטכנולוגיה בשימוש ואינך יכול למחוק אותה, ניתן לערוך בלבד.";
                } else {
                    res.deleteStatus = 500;
                    res.deleteMessage = "שגיאה במחיקת טכנולוגיה";
                }
            } else if (result.affectedRows === 0) {
                res.deleteStatus = 404;
                res.deleteMessage = "הטכנולוגיה לא נמצאה";
            } else {
                res.deleteStatus = 200;
                res.deleteMessage = "הטכנולוגיה נמחקה בהצלחה";
            }
            next();
        });
    });
}

module.exports = {
    getTechnologies,
    getTechnologiesAdmin,
    addTechnology,
    updateTechnology,
    deleteTechnology
};
