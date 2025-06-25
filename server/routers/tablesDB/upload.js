const express = require("express");
const router = express.Router();
const middleLog = require("../../middleware/login - students/middleWareLogin");
const { upload, handleFileUpload } = require("../../middleware/projects/middle_up");

// REST: Upload a file for a project
router.post('/:projectId/file', middleLog.authenticateToken, upload.single('file'), handleFileUpload, (req, res) => {
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


module.exports = router;