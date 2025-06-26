const middleLog = require("./middleWareLogin");

async function getList(req, res, next) {
    const q = `SELECT * FROM instructor`;
    db_pool.query(q, function (err, rows) {
        if (err) {
            return res.status(500).json({ message: "שגיאה בקבלת משתמשים" });
        }
        res.instructorsList = rows;
        next();
    });
}

async function Adduser(req, res, next) {
    const { userName, email, pass, first_name, last_name, phone } = req.body;
    if (!isValidPassword(pass)) {
        res.addStatus = 400;
        res.addMessage = "הסיסמה חייבת להיות לפחות 8 תווים, לכלול אות גדולה, אות קטנה, מספר ותו מיוחד. אנגלית בלבד.";
        return next();
    }
    const encryptedPass = middleLog.EncWithSalt(pass);
    const promisePool = db_pool.promise();
    try {
        const [existing] = await promisePool.query(
            `SELECT * FROM instructor WHERE user_name = ? OR email = ?`,
            [userName, email]
        );
        if (existing.length > 0) {
            const existingUser = existing.find(u => u.user_name === userName);
            const existingEmail = existing.find(u => u.email === email);
            res.addStatus = 400;
            res.addMessage = existingUser
                ? "שם משתמש כבר קיים"
                : "מייל כבר קיים";
            return next();
        }
        await promisePool.query(
            `INSERT INTO instructor (user_name, pass, email, first_name, last_name, phone)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userName, encryptedPass, email, first_name, last_name, phone]
        );
        const emailContent = `
            <h1>אישור הרשמה</h1>
            <p>שלום ${first_name} ${last_name},</p>
            <p>ההרשמה שלך הושלמה בהצלחה!</p>
            <h3>פרטי המשתמש שלך:</h3>
            <ul>
                <li><strong>שם משתמש:</strong> ${userName}</li>
                <li><strong>שם:</strong> ${first_name} ${last_name}</li>
                <li><strong>טלפון:</strong> ${phone}</li>
            </ul>
            <p>תודה שהצטרפת אלינו!</p>
        `;
        try {
            await sendMailServer(email, 'אישור הרשמה', emailContent, true);
            res.addStatus = 200;
            res.addMessage = "משתמש נוסף בהצלחה";
        } catch (mailErr) {
            console.error("שגיאה בשליחת מייל:", mailErr);
            res.addStatus = 500;
            res.addMessage = "נרשמת, אך שליחת מייל נכשלה.";
        }
        return next();
    } catch (err) {
        console.error("שגיאה בתהליך ההוספה:", err);
        res.addStatus = 500;
        res.addMessage = "שגיאה כללית בהוספת משתמש";
        return next();
    }
}

async function UpdateUser(req, res, next) {
    const id = req.user.id;
    const { user_name, first_name, last_name, email, phone, pass } = req.body;
    if (pass && !isValidPassword(pass)) {
        res.updateStatus = 400;
        res.updateMessage = "הסיסמה חייבת להיות לפחות 8 תווים, לכלול אות גדולה, אות קטנה, מספר ותו מיוחד. אנגלית בלבד.";
        return next();
    }
    let query, params;
    if (pass) {
        const encryptedPass = middleLog.EncWithSalt(pass);
        query = `
            UPDATE instructor
            SET
                first_name = ?,
                last_name = ?,
                user_name = ?,
                pass = ?,
                email = ?,
                phone = ?,
                must_change_password = 0
            WHERE id = ?
        `;
        params = [first_name, last_name, user_name, encryptedPass, email, phone, id];
    } else {
        query = `
            UPDATE instructor
            SET
                first_name = ?,
                last_name = ?,
                user_name = ?,
                email = ?,
                phone = ?,
                must_change_password = 0
            WHERE id = ?
        `;
        params = [first_name, last_name, user_name, email, phone, id];
    }
    db_pool.query(
        query,
        params,
        function (err, result) {
            if (err) {
                console.error("Update error:", err);
                res.updateStatus = 500;
                res.updateMessage = "שגיאה בעדכון משתמש";
            } else {
                res.updateStatus = 200;
                res.updateMessage = "משתמש עדכן בהצלחה";
            }
            next();
        }
    );
}

async function delUser(req, res, next) {
    const id = req.params.row_id;
    const query = `DELETE FROM instructor WHERE id=?`;
    db_pool.query(query, [id], function (err, result) {
        if (err) {
            res.deleteStatus = 500;
            res.deleteMessage = "שגיאה במחיקת משתמש";
        } else {
            res.deleteStatus = 200;
            res.deleteMessage = "משתמש נמחק בהצלחה";
        }
        next();
    });
}

async function getUser(req, res, next) {
    const userid = req.user.id;
    const query = `SELECT * FROM instructor WHERE id= ${userid}`;
    db_pool.query(query, function (err, result) {
        if (err) {
            return res.status(500).json({ message: "שגיאה בקבלת משתמש" });
        } else {
            res.instructor = result;
        }
        next();
    });
}

async function forgot_password(req, res) {
    const email = req.body.email;
    const code = () => Math.floor(100000 + Math.random() * 900000).toString();
    const resetCode = code();
    const selectQuery = `SELECT * FROM instructor WHERE email = ?`;
    db_pool.query(selectQuery, [email], function (err, result) {
        if (err || result.length === 0) {
            return res.status(404).json({ message: "לא נמצא משתמש" });
        }
        const updateQuery = `UPDATE instructor SET forgot_password = ?, reset_password_expires = NOW() WHERE email = ?`;
        db_pool.query(updateQuery, [resetCode, email], function (updateErr) {
            if (updateErr) {
                return res.status(500).json({ message: "שגיאה בעדכון קוד" });
            }
            const link = `${process.env.BASE_URL}/instructor/register/reset-password?code=${resetCode}`;
            const htmlContent = `
                <p>לאיפוס הסיסמה לחץ על הקישור:</p>
                <p><a href="${link}">לאיפוס סיסמה</a></p>
                <p>שים לב הקישור תקף לעשר דקות בלבד!</p>
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
        return renderMessagePage(res, 400, "קוד איפוס חסר", "red");
    }
    const selectQuery = `SELECT * FROM instructor WHERE forgot_password = ?`;
    db_pool.query(selectQuery, [code], function (err, result) {
        if (err || result.length === 0) {
            return renderMessagePage(res, 404, "קוד לא תקין או שפג תוקפו", "red");
        }
        const resetPasswordExpires = result[0].reset_password_expires;
        const now = new Date();
        const resetTime = new Date(resetPasswordExpires);
        const timeDifference = now - resetTime;
        if (timeDifference > 60000 * 10) {
            return renderMessagePage(res, 400, "הזמן לפעולה עבר, קוד האיפוס פג", "orange");
        }
        const newPassword = Math.floor(100000 + Math.random() * 900000).toString();
        const encryptedPass = middleLog.EncWithSalt(newPassword);
        const email = result[0].email;
        const updateQuery = `UPDATE instructor SET pass = ?, forgot_password = NULL,reset_password_expires = NULL, must_change_password = TRUE WHERE forgot_password = ?`;
        db_pool.query(updateQuery, [encryptedPass, code], function (updateErr) {
            if (updateErr) {
                return renderMessagePage(res, 500, "שגיאה באיפוס הסיסמה", "red");
            }
            const html = `<p>הסיסמה החדשה שלך היא: <strong>${newPassword}</strong></p>`;
            sendMailServer(email, 'סיסמה אופסה', html, true)
                .then(() => {
                    return renderMessagePage(res, 200, "הסיסמה אופסה ונשלחה למייל", "green");
                })
                .catch(() => {
                    return renderMessagePage(res, 500, "שגיאה בשליחת סיסמה חדשה", "red");
                });
        });
    });
}

function renderMessagePage(res, statusCode, message, color = 'black') {
    return res.status(statusCode).send(`
        <html dir="rtl">
          <head>
            <meta charset="UTF-8">
            <title>הודעה</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                direction: rtl;
                text-align: center;
                padding-top: 100px;
              }
              .message {
                font-size: 22px;
                color: ${color};
                background-color: #fff;
                padding: 20px;
                margin: auto;
                display: inline-block;
                border: 1px solid #ccc;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
            </style>
          </head>
          <body>
            <div class="message">${message}</div>
          </body>
        </html>
    `);
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function isValidPassword(pass) {
    return passwordRegex.test(pass);
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