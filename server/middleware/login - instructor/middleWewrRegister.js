const middleLog = require("./middleWareLogin");

async function getList(req, res, next) {
    const q = `SELECT * FROM teachers`;
    db_pool.query(q, function (err, rows) {
        if (err) {
            return res.status(500).json({ message: "Error fetching users" });
        }
        res.teachersList = rows;
        next();
    });
}

async function Adduser(req, res, next) {
    const { userName, email, pass, first_name, last_name, phone } = req.body;
    const encryptedPass = middleLog.EncWithSalt(pass);

    const query = `INSERT INTO teachers (user_name, pass, email, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)`;

    db_pool.query(query, [userName, encryptedPass, email, first_name, last_name, phone], function (err, result) {
        if (err) {
            res.addStatus = 500;
            res.addMessage = "Error adding user";
        } else {
            res.addStatus = 200;
            res.addMessage = "User added successfully";
        }
        next();
    });
}

async function UpdateUser(req, res, next) {
    const { id, userName, pass, email, first_name, last_name, phone } = req.body;
    const encryptedPass = middleLog.EncWithSalt(pass);

    const query = `UPDATE teachers SET first_name=?, last_name=?, user_name=?, pass=?, email=?, phone=? WHERE id=?`;

    db_pool.query(query, [first_name, last_name, userName, encryptedPass, email, phone, id], function (err, result) {
        if (err) {
            res.updateStatus = 500;
            res.updateMessage = "Error updating user";
        } else {
            res.updateStatus = 200;
            res.updateMessage = "User updated successfully";
        }
        next();
    });
}

async function delUser(req, res, next) {
    const id = req.params.row_id;
    const query = `DELETE FROM teachers WHERE id=?`;

    db_pool.query(query, [id], function (err, result) {
        if (err) {
            res.deleteStatus = 500;
            res.deleteMessage = "Error deleting user";
        } else {
            res.deleteStatus = 200;
            res.deleteMessage = "User deleted successfully";
        }
        next();
    });
}

module.exports = {
    getList,
    Adduser,
    UpdateUser,
    delUser
};
