const addNotification = require("../../services/notificationsService").addNotification;

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
    const departmentId = req.user.department_id;

    if (!departmentId) {
        res.technologyList = [];
        return next();
    }

    const q = `SELECT * FROM technology_in_use WHERE department_id = ?`;
    db_pool.query(q, [departmentId], function (err, rows) {
        if (err) {
            return res.status(500).json({ message: "שגיאה בקבלת טכנולוגיות" });
        }
        res.technologyList = rows;
        next();
    });
}

async function addTechnology(req, res, next) {
    const { technologyName, technologyTitle } = req.body;
    const userId = req.user.id;
    const departmentId = req.user.department_id;

    if (!technologyName || !technologyTitle) {
        res.addStatus = 400;
        res.addMessage = "שם וסוג הטכנולוגיה הם שדות חובה";
        return next();
    }

    if (!departmentId) {
        res.addStatus = 400;
        res.addMessage = "לא ניתן להוסיף טכנולוגיה ללא מגמה משויכת למשתמש";
        return next();
    }

    try {
        const checkQuery = `SELECT * FROM technology_in_use WHERE language = ? AND department_id = ?`;
        db_pool.query(checkQuery, [technologyName, departmentId], async (err, results) => {
            if (err) {
                res.addStatus = 500;
                res.addMessage = "שגיאה בחיבור למסד הנתונים";
                return next();
            }

            if (results.length > 0) {
                res.addStatus = 400;
                res.addMessage = "טכנולוגיה עם שם זה כבר קיימת במגמה שלך";
                return next();
            }

            const insertQuery = `INSERT INTO technology_in_use (title, language, department_id) VALUES (?, ?, ?)`;
            db_pool.query(insertQuery, [technologyTitle, technologyName, departmentId], async (err, result) => {
                if (err) {
                    res.addStatus = 500;
                    res.addMessage = "שגיאה בהוספת טכנולוגיה";
                    return next();
                } else {
                    res.addStatus = 200;
                    res.addMessage = "הטכנולוגיה נוספה בהצלחה למגמה שלך";

                    db_pool.query(
                        "SELECT id FROM instructor WHERE department_id = ? AND is_admin = 1",
                        [departmentId],
                        async (err, admins) => {
                            if (err) {
                                console.error("שגיאה בשליפת מנהל המגמה:", err);
                                return;
                            }
                            for (const admin of admins) {
                                await addNotification(
                                    admin.id,
                                    'instructor',
                                    'טכנולוגיה חדשה הוספה',
                                    `הטכנולוגיה "${technologyName}" נוספה לרשימת הטכנולוגיות. אנא בדוק את תקינות הטכנולוגיה או ערוך אותה במידת הצורך.`,
                                    'system'
                                ).catch(err => console.error('שגיאה בשליחת התראה למנהל המגמה:', err));
                            }
                        }
                    );

                    return next();
                }
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

    const checkAdminQuery = `
        SELECT is_admin, department_id
        FROM instructor
        WHERE id = ? LIMIT 1
    `;

    db_pool.query(checkAdminQuery, [userId], function (err, results) {
        if (err || results.length === 0) {
            res.updateStatus = 500;
            res.updateMessage = "שגיאה באימות המשתמש";
            return next();
        }

        const user = results[0];

        if (!user.is_admin) {
            res.updateStatus = 403;
            res.updateMessage = "אין לך הרשאה לעדכן טכנולוגיות";
            return next();
        }

        const getTechQuery = `SELECT department_id FROM technology_in_use WHERE id = ? LIMIT 1`;

        db_pool.query(getTechQuery, [technologyId], function (err2, techResults) {
            if (err2 || techResults.length === 0) {
                res.updateStatus = 404;
                res.updateMessage = "הטכנולוגיה לא נמצאה";
                return next();
            }

            if (techResults[0].department_id !== user.department_id) {
                res.updateStatus = 403;
                res.updateMessage = "אין לך הרשאה לעדכן טכנולוגיה של מגמה אחרת";
                return next();
            }

            const updateQuery = `UPDATE technology_in_use SET title = ?, language = ? WHERE id = ?`;

            db_pool.query(updateQuery, [title, language, technologyId], function (err3, result) {
                if (err3) {
                    res.updateStatus = 500;
                    res.updateMessage = "שגיאה בעדכון טכנולוגיה";
                } else {
                    res.updateStatus = 200;
                    res.updateMessage = "הטכנולוגיה עודכנה בהצלחה";
                }
                next();
            });
        });
    });
}

async function deleteTechnology(req, res, next) {
    const userId = req.user.id;
    const { technologyId } = req.params;

    const checkAdminQuery = `
        SELECT is_admin, department_id
        FROM instructor
        WHERE id = ? LIMIT 1
    `;

    db_pool.query(checkAdminQuery, [userId], function (err, results) {
        if (err || results.length === 0) {
            res.deleteStatus = 500;
            res.deleteMessage = "שגיאה באימות המשתמש";
            return next();
        }

        const user = results[0];

        if (!user.is_admin) {
            res.deleteStatus = 403;
            res.deleteMessage = "אין לך הרשאה למחוק טכנולוגיות";
            return next();
        }

        const getTechQuery = `SELECT department_id FROM technology_in_use WHERE id = ? LIMIT 1`;

        db_pool.query(getTechQuery, [technologyId], function (err2, techResults) {
            if (err2 || techResults.length === 0) {
                res.deleteStatus = 404;
                res.deleteMessage = "הטכנולוגיה לא נמצאה";
                return next();
            }

            if (techResults[0].department_id !== user.department_id) {
                res.deleteStatus = 403;
                res.deleteMessage = "אין לך הרשאה למחוק טכנולוגיה של מגמה אחרת";
                return next();
            }

            const deleteQuery = `DELETE FROM technology_in_use WHERE id = ?`;

            db_pool.query(deleteQuery, [technologyId], function (err3, result) {
                if (err3) {
                    if (err3.code === 'ER_ROW_IS_REFERENCED_2') {
                        res.deleteStatus = 400;
                        res.deleteMessage = "הטכנולוגיה בשימוש ואינך יכול למחוק אותה, ניתן לערוך בלבד.";
                    } else {
                        res.deleteStatus = 500;
                        res.deleteMessage = "שגיאה במחיקת טכנולוגיה";
                    }
                } else {
                    res.deleteStatus = 200;
                    res.deleteMessage = "הטכנולוגיה נמחקה בהצלחה";
                }
                next();
            });
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
