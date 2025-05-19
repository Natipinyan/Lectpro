const addProject = (req, res, next) => {
    const { projectName, projectDesc, selectedTechnologies } = req.body;
    const studentId = req.user.id;

    if (
        !projectName ||
        !projectDesc ||
        !studentId ||
        !selectedTechnologies ||
        !Array.isArray(selectedTechnologies) ||
        selectedTechnologies.length === 0 ||
        selectedTechnologies.some(tech => !tech.id)
    ) {
        return res.status(400).json({ message: "חסרים פרטי פרויקט, טכנולוגיות או זיהוי משתמש" });
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

            const technologyPromises = selectedTechnologies.map(({ id }) => {
                const queryTechnology = `INSERT INTO projects_technologies (project_id, technology_id) VALUES (?, ?)`;
                return new Promise((resolve, reject) => {
                    db_pool.query(queryTechnology, [projectId, id], (err3, result3) => {
                        if (err3) {
                            console.error(`DB Error (projects_technologies) for technology ID ${id}:`, err3);
                            reject({ message: `שגיאה בהוספת טכנולוגיה ID ${id}: ${err3.message}` });
                        }
                        resolve(result3);
                    });
                });
            });

            Promise.all(technologyPromises)
                .then(() => {
                    console.log("הטכנולוגיות נוספו בהצלחה");
                    next();
                })
                .catch(error => {
                    console.error(error);
                    return res.status(500).json(error);
                });
        });
    });
};

module.exports = { addProject };