const express = require('express');
const router = express.Router();

const middleLog = require("../../middleware/login - instructor/middleWareLogin");
const middleReg = require("../../middleware/login - instructor/middleWewrRegister");

// REST: Get all instructors in the department of the admin
router.get('/insByDep', middleLog.authenticateToken, middleLog.checkAdmin, middleReg.getInstructorsByDepartment, (req, res) => {
    try {
        res.status(200).json({ success: true, data: res.instructorsListByDept });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת מרצים לפי מגמה' });
    }
});

// REST: Get all students in the department of the admin
router.get('/stdByDep', middleLog.authenticateToken, middleLog.checkAdmin, middleReg.getStudentsByDepartment, (req, res) => {
    try {
        res.status(200).json({ success: true, data: res.studentsListByDept });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת סטודנטים לפי מגמה' });
    }
});

// REST: Toggle instructor active status
router.put('/toggle-status/:id', middleLog.authenticateToken, middleLog.checkAdmin, middleReg.toggleInstructorStatus, (req, res) => {
    try {
        res.status(res.toggleStatus || 200).json({success: res.toggleStatus === 200, message: res.toggleMessage
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בשינוי סטטוס מרצה' });
    }
});


// REST: Get all projects without instructor and all active instructors in admin's department
router.get('/projectsInsByDep', middleLog.authenticateToken, middleLog.checkAdmin, middleReg.getProjectsAndInstructorsByDepartment, (req, res) => {
        try {
            res.status(200).json({success: true, projects: req.projectsListByDept, instructors: req.instructorsListByDept});
        } catch (err) {
            res.status(500).json({success: false, message: 'שגיאה בקבלת פרויקטים ומרצים לפי מגמה'});
        }
    }
);

// REST: Assign an instructor to a project
router.post('/assignProjectInstructor', middleLog.authenticateToken, middleLog.checkAdmin, middleReg.assignInstructorToProject, (req, res) => {
        try {
            res.status(res.assignStatus || 200).json({success: res.assignStatus === 200, message: res.assignMessage});
        } catch (err) {
            res.status(500).json({success: false, message: 'שגיאה בקישור מרצה לפרויקט'});
        }
    }
);



module.exports = router;
