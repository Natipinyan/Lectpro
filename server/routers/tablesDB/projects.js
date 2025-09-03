const express = require('express');
const router = express.Router();
const middleLog = require("../../middleware/login - students/middleWareLogin");
const middleLogIns = require("../../middleware/login - instructor/middleWareLogin");
const middlePro = require("../../middleware/projects/middle_Projects");

// REST: Get all projects (for students)
router.get('/', middleLog.authenticateToken, middlePro.getProjects, (req, res) => {
    try {
        res.status(req.getStatus || 200).json({ success: true, data: res.projectsList, message: req.getMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת פרויקטים' });
    }
});

// REST: Get all projects (for instructor)
router.get('/ins', middleLogIns.authenticateToken, middlePro.getProjects, (req, res) => {
    try {
        res.status(req.getStatus || 200).json({ success: true, data: res.projectsList, message: req.getMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בהחזרת פרויקטים למנחה' });
    }
});

// REST: Get one project by ID (for students)
router.get('/:projectId', middleLog.authenticateToken, middlePro.getOneProject, (req, res) => {
    try {
        console.log()
        res.status(req.getStatus || 200).json({ success:true, data: res.projectData, message: req.getMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת פרויקט' });
    }
});

// REST: Get one project by ID (for instructor)
router.get('/ins/:projectId', middleLogIns.authenticateToken, middlePro.getOneProject, (req, res) => {
    try {
        res.status(req.getStatus || 200).json({ success:true, data: res.projectData, message: req.getMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת פרויקט' });
    }
});

// REST: Create a new project
router.post('/', middleLog.authenticateToken, middlePro.addProject, (req, res) => {
    try {
        res.status(res.addStatus || 201).json({ success: res.addStatus === 201, message: res.addMessage, data: res.projectData });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה ביצירת פרויקט' });
    }
});

// REST: Update a project by ID
router.put('/:projectId', middleLog.authenticateToken, middlePro.editProject, (req, res) => {
    try {
        res.status(res.updateStatus || 200).json({ success: res.updateStatus === 200, message: res.updateMessage, data: res.projectData });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בעדכון פרויקט' });
    }
});

// REST: Delete a project by ID
router.delete('/:projectId', middleLog.authenticateToken, middlePro.deleteProject, (req, res) => {
    try {
        res.status(res.deleteStatus || 200).json({ success: res.deleteStatus === 200, message: res.deleteMessage, data: res.deletedProject });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה במחיקת פרויקט' });
    }
});

// REST: Get technologies for a project (for student)
router.get('/:projectId/technologies', middleLog.authenticateToken, middlePro.getProjectTechnologies, (req, res) => {
    try {
        res.status(res.getStatus || 200).json({ success: res.getStatus === 200, data: res.technologies, message: res.getMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת טכנולוגיות' });
    }
});

// REST: Get technologies for a project (for instructor)
router.get('/ins/:projectId/technologies', middleLogIns.authenticateToken, middlePro.getProjectTechnologies, (req, res) => {
    try {
        res.status(res.getStatus || 200).json({ success: res.getStatus === 200, data: res.technologies, message: res.getMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת טכנולוגיות' });
    }
});

// REST: Get file for a project (for student)
router.get('/:projectId/file', middleLog.authenticateToken, middlePro.getProjectFile, (req, res) => {
    try {
        if (res.getStatus !== 200) {
            return res.status(res.getStatus).json({ success: false, message: res.getMessage });
        }
        res.sendFile(res.filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                return res.status(500).json({ success: false, message: 'שגיאה בשליחת קובץ' });
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בשליחת קובץ' });
    }
});

// REST: Get file for a project (for instructor)
router.get('/ins/:projectId/file', middleLogIns.authenticateToken, middlePro.getProjectFile, (req, res) => {
    try {
        if (res.getStatus !== 200) {
            return res.status(res.getStatus).json({ success: false, message: res.getMessage });
        }
        res.sendFile(res.filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                return res.status(500).json({ success: false, message: 'שגיאה בשליחת קובץ' });
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בשליחת קובץ' });
    }
});

module.exports = router;