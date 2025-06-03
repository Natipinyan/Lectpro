const express = require("express");
const router = express.Router();
const middleLog = require("../../middleware/login - students/middleWareLogin");
const { upload, handleFileUpload } = require("../../middleware/projects/middle_up");

router.post('/addFile', middleLog.authenticateToken, upload.single('file'), handleFileUpload, (req, res) => {
    return res.status(200).json({
        message: req.uploadResult.message,
        filePath: req.uploadResult.filePath
    });
});

module.exports = router;
