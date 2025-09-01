const express = require('express');
const router = express.Router();

const middleReg = require("../../../middleware/login - instructor/middleWewrRegister");
const middleLog = require("../../../middleware/login - instructor/middleWareLogin");

// REST: Get all instructors
router.get('/', middleLog.authenticateToken, middleReg.getList, (req, res) => {
    try {
        res.status(200).json({ success: true, data: res.instructorsList });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת מרצים' });
    }
});


// REST: Register new instructor
router.post('/', middleReg.Adduser, (req, res) => {
    try {
        res.status(res.addStatus || 200).json({ success: res.addStatus === 201, message: res.addMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בהרשמת מרצה' });
    }
});

// REST: Register new administrator
router.post('/administrator', middleReg.AddAdminInstructor, (req, res) => {
    try {
        res.status(res.addStatus || 200).json({ success: res.addStatus === 201, message: res.addMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בהרשמת מרצה' });
    }
});

// REST: Update current instructor
router.put('/me', middleLog.authenticateToken, middleReg.UpdateUser, (req, res) => {
    try {
        res.status(res.updateStatus || 200).json({ success: res.updateStatus === 200, message: res.updateMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בעדכון מרצה' });
    }
});

// REST: Delete current instructor
router.delete('/me', middleLog.authenticateToken, middleReg.delUser, (req, res) => {
    try {
        res.status(res.deleteStatus || 200).json({ success: res.deleteStatus === 200, message: res.deleteMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה במחיקת מרצה' });
    }
});

// REST: Get current instructor
router.get('/me', middleLog.authenticateToken, middleReg.getUser, (req, res) => {
    try {
        res.status(200).json({ success: true, data: res.instructor });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת מרצה' });
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

module.exports = router;
