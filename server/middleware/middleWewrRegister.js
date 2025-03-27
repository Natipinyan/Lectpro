const middleLog = require("./middleWareLogin");

async function getList(req, res) {
    const q = `SELECT * FROM students`;
    db_pool.query(q, function (err, rows, fields) {
        if (err) {
            res.status(500).json({ message: "Error fetching users" });
        } else {
            res.status(200).json(rows);
        }
    });
}


async function Adduser(req, res) {
    const { userName, email, name, pass ,first_name,last_name , phone } = req.body;
    const encryptedPass = middleLog.EncWithSalt(pass);

    const query = `INSERT INTO students (user_name, pass, email, first_name, last_name , phone) VALUES ('${userName}', '${encryptedPass}', '${email}', '${first_name}','${last_name}', '${phone}')`;

    db_pool.query(query, function (err, result) {
        if (err) {
            res.status(500).json({ message: "Error adding user" });
        } else {
            res.status(200).json({ message: "User added successfully" });
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
    //UpdateUser: UpdateUser,
    delUser: delUser
};
