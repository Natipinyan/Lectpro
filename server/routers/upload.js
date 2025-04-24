const express = require("express");
const router = express.Router();
const middleup = require("../middleware/middle_up");

router.post('/addFile', middleup.upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "לא נשלח קובץ" });
    }

    res.json({
        message: "הקובץ הועלה בהצלחה!",
        fileName: req.file.originalname,
        filePath: `/filesApp/${req.file.originalname}`
    });
});

module.exports = router;
