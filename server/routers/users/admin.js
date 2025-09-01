const express = require('express');
const router = express.Router();

const middleLog = require("../../middleware/login - instructor/middleWareLogin");
const middleReg = require("../../middleware/login - instructor/middleWewrRegister");

// REST: Get all instructors in the department of the admin
router.get('/insByDep', middleLog.authenticateToken, middleReg.getInstructorsByDepartment, (req, res) => {
    try {
        res.status(200).json({ success: true, data: res.instructorsListByDept });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת מרצים לפי מגמה' });
    }
});

// REST: Get all students in the department of the admin
router.get('/stdByDep', middleLog.authenticateToken, middleReg.getStudentsByDepartment, (req, res) => {
    try {
        res.status(200).json({ success: true, data: res.studentsListByDept });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת סטודנטים לפי מגמה' });
    }
});
// REST: Toggle instructor active status
router.put('/toggle-status/:id', middleLog.authenticateToken, middleReg.toggleInstructorStatus, (req, res) => {
    try {
        res.status(res.toggleStatus || 200).json({success: res.toggleStatus === 200, message: res.toggleMessage
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בשינוי סטטוס מרצה' });
    }
});


module.exports = router;
