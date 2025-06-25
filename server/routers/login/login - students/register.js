const express = require('express');
const router = express.Router();
module.exports = router;

const middleReg = require("../../../middleware/login - students/middleWewrRegister");
const middleLog = require("../../../middleware/login - students/middleWareLogin");

// REST: Get all students
router.get('/', middleLog.authenticateToken, middleReg.getList, (req, res) => {
    try {
        res.status(200).json({ success: true, data: res.studentsList });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת סטודנטים' });
    }
});

// REST: Register new student
router.post('/', middleReg.Adduser, (req, res) => {
    try {
        res.status(res.addStatus).json({ success: res.addStatus === 201, message: res.addMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בהרשמת סטודנט' });
    }
});

// REST: Update current student
router.put('/me', middleLog.authenticateToken, middleReg.UpdateUser, (req, res) => {
    try {
        res.status(res.updateStatus || 200).json({ success: res.updateStatus === 200, message: res.updateMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בעדכון סטודנט' });
    }
});

// REST: Delete current student
router.delete('/me', middleLog.authenticateToken, middleReg.delUser, (req, res) => {
    try {
        res.status(res.deleteStatus || 200).json({ success: res.deleteStatus === 200, message: res.deleteMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה במחיקת סטודנט' });
    }
});

// REST: Get current student
router.get('/me', middleLog.authenticateToken, middleReg.getUser, (req, res) => {
    try {
        res.status(200).json({ success: true, data: res.student });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת סטודנט' });
    }
});

// REST: Forgot password
router.post('/forgot-password', middleReg.forgot_password, (req, res) => {
    try {
        res.status(200).json({ success: true, message: 'אימייל לאיפוס סיסמה נשלח' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בשליחת אימייל איפוס סיסמה' });
    }
 });

// REST: Reset password
router.get('/reset-password', middleReg.resetPassword, (req, res) => {
    try {
        res.status(200).json({ success: true, message: 'הסיסמה אופסה בהצלחה' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה באיפוס סיסמה' });
    }
});

;