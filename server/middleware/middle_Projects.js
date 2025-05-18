const addProject = (req, res, next) => {
    const { projectName, projectDesc } = req.body;

    const query = `INSERT INTO projects (title, description) VALUES (?, ?)`;

    db_pool.query(query, [projectName, projectDesc], function (err, result) {
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ message: "שגיאה בהוספת הפרויקט" });
        } else {
            console.log("הפרויקט נוסף למסד הנתונים:", { projectName, projectDesc });
            next();
        }
    });
};

module.exports = { addProject };