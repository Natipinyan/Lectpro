const express = require("express");
const router = express.Router();
const middleLog = require("../../middleware/login - students/middleWareLogin");
const middleRole = require("../../middleware/role");
const { upload, handleFileUpload } = require("../../middleware/projects/middle_up");
const { uploadTwoFiles, handleTwoFileUpload } = require("../../middleware/projects/middle_up");

// REST: Upload a file for a project
router.post('/:projectId/file', middleLog.authenticateToken,middleRole.getRole, upload.single('file'), handleFileUpload, (req, res) => {
    try {
        return res.status(201).json({
            success: true,
            message: req.uploadResult.message,
            data: { filePath: req.uploadResult.filePath }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'שגיאה בהעלאת קובץ' });
    }
});

// Middleware to handle file and image upload
router.post('/:projectId/uploadTwoFiles', middleLog.authenticateToken,middleRole.getRole, uploadTwoFiles, handleTwoFileUpload, (req, res) => {
    return res.status(201).json({
        success: true,
        message: req.uploadResult.message,
    });
});



module.exports = router;