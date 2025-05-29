const express = require('express');
const router = express.Router();
module.exports = router;

const middleReg = require("../../../middleware/login - students/middleWewrRegister");
const middleLog = require("../../../middleware/login - students/middleWareLogin");

router.get("/List", middleReg.getList, (req, res) => {
    res.status(200).json(res.studentsList);
});

router.post("/Add", middleReg.Adduser, async (req, res) => {
    try {
        const { userName, email, pass, first_name, last_name, phone } = req.body;

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

        await sendMailServer(
            email,
            'אישור הרשמה',
            emailContent,
            true
        );

        res.status(res.addStatus || 200).json({ message: res.addMessage });

    } catch (error) {
        console.error('שגיאה בשליחת מייל האישור:', error);
        res.status(500).json({ message: 'נרשמת, אך שליחת מייל נכשלה.', error: error.message });
    }
});

router.post("/Update",middleLog.authenticateToken, middleReg.UpdateUser, (req, res) => {
    res.status(res.updateStatus || 200).json({ message: res.updateMessage });
});

router.delete("/Delete/:row_id", middleReg.delUser, (req, res) => {
    res.status(res.deleteStatus || 200).json({ message: res.deleteMessage });
});

router.get("/getUser",middleLog.authenticateToken, middleReg.getUser, (req, res) => {
    res.status(200).json(res.student);
});
