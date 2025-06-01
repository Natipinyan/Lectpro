const middleLog = require("./middleWareLogin");

async function getList(req, res, next) {
    const q = `SELECT * FROM students`;
    db_pool.query(q, function (err, rows) {
        if (err) {
            return res.status(500).json({ message: "Error fetching users" });
        }
        res.studentsList = rows;
        next();
    });
}

async function Adduser(req, res, next) {
    const { userName, email, pass, first_name, last_name, phone } = req.body;
    const encryptedPass = middleLog.EncWithSalt(pass);

    // בדיקת אם שם המשתמש או המייל כבר קיימים
    const checkQuery = `SELECT * FROM students WHERE user_name = ? OR email = ?`;

    db_pool.query(checkQuery, [userName, email], function (err, result) {
        if (err) {
            res.addStatus = 500;
            res.addMessage = "שגיאה בבדיקת נתונים";
            return next();
        }

        if (result.length > 0) {
            const existingUser = result.find(user => user.user_name === userName);
            const existingEmail = result.find(user => user.email === email);

            if (existingUser) {
                res.addStatus = 400;
                res.addMessage = "שם משתמש כבר קיים";
            } else if (existingEmail) {
                res.addStatus = 400;
                res.addMessage = "מייל כבר קיים";
            }
            return next();
        }

        const query = `INSERT INTO students (user_name, pass, email, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)`;

        db_pool.query(query, [userName, encryptedPass, email, first_name, last_name, phone], function (err, result) {
            if (err) {
                res.addStatus = 500;
                res.addMessage = "שגיאה בהוספת משתמש";
            } else {
                res.addStatus = 200;
                res.addMessage = "משתמש נוסף בהצלחה";
            }
            next();
        });
    });
}


async function UpdateUser(req, res, next) {
    const id = req.user.id;
    const { user_name, first_name, last_name, email, phone, pass } = req.body;

    const encryptedPass = middleLog.EncWithSalt(pass);
    const query = `UPDATE students SET first_name=?, last_name=?, user_name=?, pass=?, email=?, phone=? WHERE id=?`;

    db_pool.query(query, [first_name, last_name, user_name, encryptedPass, email, phone, id], function (err, result) {
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
    const query = `DELETE FROM students WHERE id=?`;

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

async function getUser(req, res, next) {
    const userid = req.user.id;
    //console.log("Fetching user with ID:", userid);
    const query = `SELECT * FROM students WHERE id= ${userid}`;

    db_pool.query(query, function (err, result) {
        if (err) {
            return res.status(500).json({ message: "Error fetching user" });
        } else {
            res.student = result;
        }
        next();
    });
}

async function forgot_password(req, res) {
    const email = req.body.email;
    const code = () => Math.floor(100000 + Math.random() * 900000).toString();
    const resetCode = code();
    console.log(email)

    const selectQuery = `SELECT * FROM students WHERE email = ?`;
    db_pool.query(selectQuery, [email], function (err, result) {
        if (err || result.length === 0) {
            return res.status(404).json({ message: "לא נמצא משתמש" });
        }

        const updateQuery = `UPDATE students SET forgot_password = ?, reset_password_expires = NOW() WHERE email = ?`;
        db_pool.query(updateQuery, [resetCode, email], function (updateErr) {
            if (updateErr) {
                return res.status(500).json({ message: "שגיאה בעדכון קוד" });
            }

            const link = `${process.env.BASE_URL}/students/register/upPass?code=${resetCode}`;

            const htmlContent = `
                <p>לאיפוס הסיסמה לחץ על הקישור:</p>
                <p><a href="${link}">לאיפוס סיסמה</a></p>
            `;

            sendMailServer(email, 'איפוס סיסמה', htmlContent, true)
                .then(() => {
                    return res.status(200).json({ message: "נשלח קישור לאיפוס סיסמה" });
                })
                .catch(() => {
                    return res.status(500).json({ message: "שגיאה בשליחת מייל" });
                });
        });
    });
}

async function resetPassword(req, res) {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ message: "קוד איפוס חסר" });
    }

    const selectQuery = `SELECT * FROM students WHERE forgot_password = ?`;
    db_pool.query(selectQuery, [code], function (err, result) {
        if (err || result.length === 0) {
            return res.status(404).json({ message: "קוד לא תקין או שפג תוקפו" });
        }

        const resetPasswordExpires = result[0].reset_password_expires;

        const now = new Date();
        const resetTime = new Date(resetPasswordExpires);
        const timeDifference = now - resetTime;

        if (timeDifference > 60000 * 10) {
            return res.status(400).json({ message: "הזמן לפעולה עבר, קוד האיפוס פג" });
        }

        const newPassword = Math.floor(100000 + Math.random() * 900000).toString();

        const encryptedPass = middleLog.EncWithSalt(newPassword);

        const email = result[0].email;

        const updateQuery = `UPDATE students SET pass = ?, forgot_password = NULL WHERE forgot_password = ?`;
        db_pool.query(updateQuery, [encryptedPass, code], function (updateErr) {
            if (updateErr) {
                return res.status(500).json({ message: "שגיאה באיפוס הסיסמה" });
            }

            const html = `<p>הסיסמה החדשה שלך היא: <strong>${newPassword}</strong></p>`;
            sendMailServer(email, 'סיסמה אופסה', html, true)
                .then(() => {
                    return res.status(200).json({ message: "הסיסמה אופסה ונשלחה למייל" });
                })
                .catch(() => {
                    return res.status(500).json({ message: "שגיאה בשליחת סיסמה חדשה" });
                });
        });
    });
}



module.exports = {
    getList,
    Adduser,
    UpdateUser,
    delUser,
    getUser,
    forgot_password,
    resetPassword
};
