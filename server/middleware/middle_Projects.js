
const addProject = (req, res, next) => {
    const { projectName, projectDesc } = req.body;
    const studentId = req.user.id;

    if (!projectName || !projectDesc || !studentId) {
        return res.status(400).json({ message: "חסרים פרטי פרויקט או זיהוי משתמש" });
    }

    const queryProject = `INSERT INTO projects (title, description, student_id1) VALUES (?, ?, ?)`;
    db_pool.query(queryProject, [projectName, projectDesc, studentId], (err, result) => {
        if (err) {
            console.error("DB Error (projects):", err);
            return res.status(500).json({ message: "שגיאה בהוספת הפרויקט" });
        }

        const projectId = result.insertId;


        const queryUpdateStudent = `UPDATE students SET project_id = ? WHERE id = ?`;
        db_pool.query(queryUpdateStudent, [projectId, studentId], (err2, result2) => {
            if (err2) {
                console.error("DB Error (students update):", err2);
                return res.status(500).json({ message: "שגיאה בעדכון הסטודנט" });
            }
            console.log("הסטודנט עודכן עם project_id:", projectId);
            next();
        });
    });
};

module.exports = { addProject };