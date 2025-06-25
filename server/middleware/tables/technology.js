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
    const currentLanguage = req.body.currentLanguage;
    const newLanguage = req.body.newLanguage;

    const selectQuery = `SELECT id FROM technology_in_use WHERE language = ? LIMIT 1`;

    db_pool.query(selectQuery, [currentLanguage], function (err, results) {
        if (err || results.length === 0) {
            res.updateStatus = 404;
            res.updateMessage = "לא נמצאה טכנולוגיה עם השפה שצוינה";
            return next();
        }

        const techId = results[0].id;

        const updateQuery = `UPDATE technology_in_use SET language = ? WHERE id = ?`;

        db_pool.query(updateQuery, [newLanguage, techId], function (err2, result) {
            if (err2) {
                res.updateStatus = 500;
                res.updateMessage = "שגיאה בעדכון טכנולוגיה";
            } else {
                res.updateStatus = 200;
                res.updateMessage = "הטכנולוגיה עודכנה בהצלחה";
            }
            next();
        });
    });
}
async function deleteTechnology(req, res, next) {
    const currentLanguage = req.body.currentLanguage;

    const selectQuery = `SELECT id FROM technology_in_use WHERE language = ? LIMIT 1`;

    db_pool.query(selectQuery, [currentLanguage], function (err, results) {
        if (err || results.length === 0) {
            res.deleteStatus = 404;
            res.deleteMessage = "לא נמצאה טכנולוגיה עם השפה שצוינה";
            return next();
        }

        const techId = results[0].id;

        const deleteQuery = `DELETE FROM technology_in_use WHERE id = ?`;

        db_pool.query(deleteQuery, [techId], function (err2, result) {
            if (err2) {
                res.deleteStatus = 500;
                res.deleteMessage = "שגיאה במחיקת טכנולוגיה";
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
    addTechnology,
    updateTechnology,
    deleteTechnology
};
