const express = require("express");
const router = express.Router();
const middleLog = require("../../middleware/login - students/middleWareLogin");
const { upload, handleFileUpload } = require("../../middleware/projects/middle_up");

// Upload a file for a project (RESTful)
router.post('/:projectId/file', middleLog.authenticateToken, upload.single('file'), handleFileUpload, (req, res) => {
    return res.status(201).json({
        message: req.uploadResult.message,
        filePath: req.uploadResult.filePath
    });
});


module.exports = router;