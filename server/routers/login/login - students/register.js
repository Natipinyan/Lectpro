const express = require('express');
const router = express.Router();
module.exports = router;

const middleReg = require("../../../middleware/login - students/middleWewrRegister");
const middleLog = require("../../../middleware/login - students/middleWareLogin");

// Get all students (RESTful)
router.get('/', middleLog.authenticateToken, middleReg.getList, (req, res) => {
    res.status(200).json(res.studentsList);
});

// Register new student (RESTful)
router.post('/', middleReg.Adduser, (req, res) => {
    res.status(res.addStatus).json({ message: res.addMessage });
});

// Update current student (RESTful)
router.put('/me', middleLog.authenticateToken, middleReg.UpdateUser, (req, res) => {
    res.status(res.updateStatus || 200).json({ message: res.updateMessage });
});

// Delete current student (RESTful)
router.delete('/me', middleLog.authenticateToken, middleReg.delUser, (req, res) => {
    res.status(res.deleteStatus || 200).json({ message: res.deleteMessage });
});

// Get current student (RESTful)
router.get('/me', middleLog.authenticateToken, middleReg.getUser, (req, res) => {
    res.status(200).json(res.student);
});

// // Forgot password (RESTful)
router.post('/forgot-password', middleReg.forgot_password, (req, res) => {
    res.status(200).json();
 });

// Reset password (RESTful)
router.get('/reset-password', middleReg.resetPassword, (req, res) => {
    res.status(200).json();
});

;