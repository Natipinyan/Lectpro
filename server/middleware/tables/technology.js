async function getTechnologies(req, res, next) {
    const q = `SELECT * FROM technology_in_use`;
    db_pool.query(q, function (err, rows) {
        if (err) {
            return res.status(500).json({ message: "Error fetching technologies" });
        }
        res.technologyList = rows;
        next();
    });
}


async function addTechnology(req, res, next) {
    const { technologyName, technologyTitle } = req.body;

    const query = `INSERT INTO technology_in_use (title, language) VALUES (?, ?)`;

    db_pool.query(query, [technologyTitle, technologyName], function (err, result) {
        if (err) {
            res.addStatus = 500;
            res.addMessage = "Error adding technology";
        } else {
            res.addStatus = 200;
            res.addMessage = "Technology added successfully";
        }
        next();
    });
}


async function updateTechnology(req, res, next) {
    const currentLanguage = req.body.currentLanguage;
    const newLanguage = req.body.newLanguage;

    const selectQuery = `SELECT id FROM technology_in_use WHERE language = ? LIMIT 1`;

    db_pool.query(selectQuery, [currentLanguage], function (err, results) {
        if (err || results.length === 0) {
            res.updateStatus = 404;
            res.updateMessage = "Technology with the specified language not found";
            return next();
        }

        const techId = results[0].id;

        const updateQuery = `UPDATE technology_in_use SET language = ? WHERE id = ?`;

        db_pool.query(updateQuery, [newLanguage, techId], function (err2, result) {
            if (err2) {
                res.updateStatus = 500;
                res.updateMessage = "Error updating technology";
            } else {
                res.updateStatus = 200;
                res.updateMessage = "Technology updated successfully";
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
            res.deleteMessage = "Technology with the specified language not found";
            return next();
        }

        const techId = results[0].id;

        const deleteQuery = `DELETE FROM technology_in_use WHERE id = ?`;

        db_pool.query(deleteQuery, [techId], function (err2, result) {
            if (err2) {
                res.deleteStatus = 500;
                res.deleteMessage = "Error deleting technology";
            } else {
                res.deleteStatus = 200;
                res.deleteMessage = "Technology deleted successfully";
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
