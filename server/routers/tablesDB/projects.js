const express = require("express");
const router = express.Router();
const middleLog = require("../../middleware/login - students/middleWareLogin");
const middleLogIns = require("../../middleware/login - instructor/middleWareLogin");
const middlePro = require("../../middleware/projects/middle_Projects");

// REST: Get all projects
router.get('/', middleLog.authenticateToken, middlePro.getProjects, (req, res) => {
    try {
        res.status(200).json({ success: true, data: res.projectsList });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת פרויקטים' });
    }
});

// REST: Get projects by instructor
router.get('/ins', middleLogIns.authenticateToken, middlePro.getProjectsByInstructor, (req, res) => {
    try {
        return res.status(200).json({ success: true, data: res.projectsList });
    } catch (err) {
        return res.status(500).json({ success: false, message: "שגיאה בהחזרת פרויקטים למנחה" });
    }
});


// REST: Get one project by ID
router.get('/:projectId', middleLog.authenticateToken, middlePro.getOneProject, (req, res) => {
    try {
        res.status(200).json({ success: true, data: res.project });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת פרויקט' });
    }
});

// REST: Create a new project
router.post('/', middleLog.authenticateToken, middlePro.addProject, (req, res) => {
    try {
        res.status(201).json({ success: true, message: "הפרויקט נוצר בהצלחה!" });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה ביצירת פרויקט' });
    }
});

// REST: Update a project by ID
router.put('/:projectId', middleLog.authenticateToken, middlePro.editProject, (req, res) => {
    try {
        res.status(200).json({ success: true, message: "הפרויקט עודכן בהצלחה!" });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בעדכון פרויקט' });
    }
});

// REST: Delete a project by ID
router.delete('/:projectId', middleLog.authenticateToken, middlePro.deleteProject, (req, res) => {
    try {
        res.status(200).json({ success: true, message: "הפרויקט נמחק בהצלחה!" });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה במחיקת פרויקט' });
    }
});

// REST: Get technologies for a project
router.get('/:projectId/technologies', middleLog.authenticateToken, middlePro.getProjectTechnologies, (req, res) => {
    try {
        res.status(200).json({ success: true, data: res.technologies });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת טכנולוגיות' });
    }
});


// REST: Get file for a project
router.get('/:projectId/file', middleLog.authenticateToken, middlePro.getProjectFile, (req, res) => {
    res.sendFile(res.filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            return res.status(500).json({ success: false, message: 'שגיאה בשליחת קובץ' });
        }
    });
});

module.exports = router;