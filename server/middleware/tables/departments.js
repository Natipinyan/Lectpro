async function getDepartmentByInstructorId(req, res, next) {
    const instructorId = req.user.id;

    const selectInstructor = `SELECT department_id FROM instructor WHERE id = ?`;
    db_pool.query(selectInstructor, [instructorId], (err, instructorRows) => {
        if (err || instructorRows.length === 0) {
            res.departmentStatus = 404;
            res.departmentMessage = "מרצה לא נמצא או שגיאה בשרת";
            return next();
        }

        const departmentId = instructorRows[0].department_id;
        const selectDepartment = `SELECT * FROM departments WHERE id = ?`;
        db_pool.query(selectDepartment, [departmentId], (err2, departmentRows) => {
            if (err2 || departmentRows.length === 0) {
                res.departmentStatus = 404;
                res.departmentMessage = "מגמה לא נמצאה";
                return next();
            }

            res.department = departmentRows[0];
            res.departmentStatus = 200;
            res.departmentMessage = "המגמה נמצאה בהצלחה";
            next();
        });
    });
}

async function updateDepartmentNameById(req, res, next) {
    const userId = req.user.id;
    const { newName, currentID: departmentId } = req.body;

    if (!newName) {
        res.updateStatus = 400;
        res.updateMessage = "חייב לציין שם חדש למגמה";
        return next();
    }

    const checkAdminQuery = `
        SELECT * FROM instructor
        WHERE id = ? AND department_id = ? AND is_admin = 1 LIMIT 1
    `;

    db_pool.query(checkAdminQuery, [userId, departmentId], (err, results) => {
        if (err) {
            res.updateStatus = 500;
            res.updateMessage = "שגיאה בבדיקת הרשאות המנהל";
            return next();
        }

        if (results.length === 0) {
            res.updateStatus = 403;
            res.updateMessage = "אתה לא מנהל של מגמה זו";
            return next();
        }

        const updateQuery = `UPDATE departments SET name = ? WHERE id = ?`;
        db_pool.query(updateQuery, [newName, departmentId], (err2, result) => {
            if (err2) {
                res.updateStatus = 500;
                res.updateMessage = "שגיאה בעדכון המגמה";
            } else {
                res.updateStatus = 200;
                res.updateMessage = "המגמה עודכנה בהצלחה";
            }
            next();
        });
    });
}

module.exports = {
    getDepartmentByInstructorId,
    updateDepartmentNameById
};
