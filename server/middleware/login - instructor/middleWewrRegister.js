const middleLog = require("./middleWareLogin");

async function getList(req, res, next) {
    const query = `SELECT * FROM teachers`;
    db_pool.query(query, function (err, rows) {
        if (err) {
            return res.status(500).json({ message: "שגיאה בשליפת משתמשים" });
        }
        res.studentsList = rows;
        next();
    });
}

async function AddUser(req, res, next) {
    const { userName, email, pass, first_name, last_name, phone } = req.body;
    const encryptedPass = middleLog.EncWithSalt(pass);

    const query = `INSERT INTO teachers (user_name, pass, email, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)`;

    const promisePool = db_pool.promise();

    try {
        const [result] = await promisePool.query(query, [userName, encryptedPass, email, first_name, last_name, phone]);
        res.status(200).json({ message: "מרצה נוסף בהצלחה", teacherId: result.insertId });
    } catch (err) {
        console.error("Error adding teacher:", err);
        res.status(500).json({ message: "שגיאה בהוספת מרצה", error: err.message });
    }
}

async function UpdateUser(req, res, next) {
    const { id, userName, pass, email, first_name, last_name, phone } = req.body;
    const encryptedPass = middleLog.EncWithSalt(pass);

    const query = `UPDATE teachers SET first_name=?, last_name=?, user_name=?, pass=?, email=?, phone=? WHERE id=?`;
    const promisePool = db_pool.promise();

    try {
        const [result] = await promisePool.query(query, [first_name, last_name, userName, encryptedPass, email, phone, id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "מרצה לא נמצא" });
        } else {
            res.status(200).json({ message: "פרטי המרצה עודכנו בהצלחה" });
        }
    } catch (err) {
        console.error("Error updating teacher:", err);
        res.status(500).json({ message: "שגיאה בעדכון פרטי מרצה", error: err.message });
    }
}

async function delUser(req, res, next) {
    const id = req.params.row_id;
    const query = `DELETE FROM teachers WHERE id=?`;
    const promisePool = db_pool.promise();

    try {
        const [result] = await promisePool.query(query, [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "מרצה לא נמצא" });
        } else {
            res.status(200).json({ message: "מרצה נמחק בהצלחה" });
        }
    } catch (err) {
        console.error("Error deleting teacher:", err);
        res.status(500).json({ message: "שגיאה במחיקת מרצה", error: err.message });
    }
}

module.exports = {
    getList,
    AddUser,
    UpdateUser,
    delUser,
};