const express = require('express');
const router = express.Router();
const middleLogIns = require("../../middleware/login - instructor/middleWareLogin");
const middleLog = require("../../middleware/login - students/middleWareLogin");
const middleDepartments = require("../../middleware/tables/departments");

// REST: Get all departments
router.get('/all', middleDepartments.getDepartment, (req, res) => {
    try {
        res.status(res.departmentStatus || 200).json({success: res.departmentStatus === 200, message: res.departmentMessage, data: res.departments || []
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת המגמות' });
    }
});


// REST: Get department by instructor ID
router.get('/', middleLogIns.authenticateToken, middleDepartments.getDepartmentByInstructorId, (req, res) => {
    try {
        res.status(res.departmentStatus || 200).json({success: res.departmentStatus === 200, message: res.departmentMessage, data: res.department || null});
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת המגמה' });
    }
});


// REST: Get department by student ID
router.get('/std', middleLog.authenticateToken, middleDepartments.getDepartmentByStdId, (req, res) => {
    try {
        res.status(res.departmentStatus || 200).json({success: res.departmentStatus === 200, message: res.departmentMessage, data: res.department || null});
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת המגמה' });
    }
});

// REST: Update department name by ID
router.put('/:departmentId', middleLogIns.authenticateToken, middleDepartments.updateDepartmentNameById, (req, res) => {
    try {
        res.status(res.updateStatus || 200).json({success: res.updateStatus === 200, message: res.updateMessage});
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בעדכון המגמה' });
    }
});


module.exports = router;
