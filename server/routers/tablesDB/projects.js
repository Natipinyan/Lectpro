const express = require('express');
const router = express.Router();
const middleLog = require("../../middleware/login - students/middleWareLogin");
const middleLogIns = require("../../middleware/login - instructor/middleWareLogin");
const middlePro = require("../../middleware/projects/middle_Projects");
const middleRole = require("../../middleware/role");
const middleResponse = require("../../middleware/response");

// REST: Get all projects (for students and instructors)
router.get(
    '/',
    middleRole.getRole,
    middlePro.getProjects,
    (req, res) => {
        middleResponse.sendResponse(res);
    }
);

// REST: Get one project by ID (for students and instructors)
router.get('/:projectId',
    middleRole.getRole,
    middlePro.getOneProject,
    (req, res) => {
        middleResponse.sendResponse(res);}
);

// REST: add a new project (for students only)
router.post(
    '/',
    middleRole.getRole,
    middlePro.addProject,
    (req, res) => {
        middleResponse.sendResponse(res);}
);

// REST: Get technologies for a project (for students and instructors)
router.get('/:projectId/technologies',
    middleRole.getRole,
    middlePro.getProjectTechnologies,
    (req, res) => {
        middleResponse.sendResponse(res);}
);


// REST: Update a project by ID (for students only)
router.put('/:projectId', middleRole.getRole, middlePro.editProject, (req, res) => {
    try {
        res.status(res.updateStatus || 200).json({success: res.updateStatus === 200, message: res.updateMessage
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בעדכון פרויקט' });
    }
});


// REST: Delete a project by ID (for students only)
router.delete('/:projectId', middleRole.getRole, middlePro.deleteProject, (req, res) => {
    try {
        res.status(res.deleteStatus || 200).json({ success: res.deleteStatus === 200, message: res.deleteMessage, data: res.deletedProject });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה במחיקת פרויקט' });
    }
});



// REST: Get file for a project (for students and instructors)
router.get('/:projectId/file',middleRole.getRole, middlePro.getProjectFile, (req, res) => {
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