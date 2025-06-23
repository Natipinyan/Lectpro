const express = require("express");
const router = express.Router();
const middleLog = require("../../middleware/login - students/middleWareLogin");
const middlePro = require("../../middleware/projects/middle_Projects");

// RESTful: Get all projects
router.get('/', middleLog.authenticateToken, middlePro.getProjects, (req, res) => {
    res.status(200).json(res.projectsList);
});

// RESTful: Get one project by ID
router.get('/:projectId', middleLog.authenticateToken, middlePro.getOneProject, (req, res) => {
    res.status(200).json(res.project);
});

// RESTful: Create a new project
router.post('/', middleLog.authenticateToken, middlePro.addProject, (req, res) => {
    return res.status(201).json({ message: "Project created successfully!" });
});

// RESTful: Update a project by ID
router.put('/:projectId', middleLog.authenticateToken, middlePro.editProject, (req, res) => {
    return res.status(200).json({ message: "Project updated successfully!" });
});

// RESTful: Delete a project by ID
router.delete('/:projectId', middleLog.authenticateToken, middlePro.deleteProject, (req, res) => {
    return res.status(200).json({ message: "Project deleted successfully!" });
});

// RESTful: Get technologies for a project
router.get('/:projectId/technologies', middleLog.authenticateToken, middlePro.getProjectTechnologies, (req, res) => {
    res.status(200).json(res.technologies);
});

// RESTful: Get file for a project
router.get('/:projectId/file', middleLog.authenticateToken, middlePro.getProjectFile, (req, res) => {
    res.sendFile(res.filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            return res.status(500).json({ message: 'Error sending file' });
        }
    });
});

module.exports = router;