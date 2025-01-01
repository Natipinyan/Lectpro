const middleLog = require("./middleWareLogin");

async function getList(req, res) {
    const q = `SELECT * FROM users`;
    db_pool.query(q, function (err, rows, fields) {
        if (err) {
            res.status(500).json({ message: "Error fetching users" });
        } else {
            res.status(200).json(rows);
        }
    });
}


async function Adduser(req, res) {
    const { userName, email, name, pass } = req.body;
    const encryptedPass = middleLog.EncWithSalt(pass);

    const query = `INSERT INTO users (name, userName, pass, email) VALUES ('${name}', '${userName}', '${encryptedPass}', '${email}')`;

    db_pool.query(query, function (err, result) {
        if (err) {
            res.status(500).json({ message: "Error adding user" });
        } else {
            res.status(200).json({ message: "User added successfully" });
        }
    });
}

async function UpdateUser(req, res) {
    const { id, name, userName, pass, email } = req.body;
    const query = `UPDATE users SET name='${name}', userName='${userName}', pass='${pass}', email='${email}' WHERE id=${id}`;

    db_pool.query(query, function (err, result) {
        if (err) {
            res.status(500).json({ message: "Error updating user" });
        } else {
            res.status(200).json({ message: "User updated successfully" });
        }
    });
}

async function delUser(req, res) {
    const id = req.params.row_id;
    const query = `DELETE FROM users WHERE id='${id}'`;

    db_pool.query(query, function (err, result) {
        if (err) {
            res.status(500).json({ message: "Error deleting user" });
        } else {
            res.status(200).json({ message: "User deleted successfully" });
        }
    });
}

module.exports = {
    getList: getList,
    Adduser: Adduser,
    UpdateUser: UpdateUser,
    delUser: delUser
};
