/*const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const middleLog = require("../../middleware/login-instructor/middleWareLogin");

// הגדרת אחסון לקבצים
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "uploads/"); // תיקייה לשמירת הקבצים
    },
    filename: (req, file, cb) => {
        const userId = req.user.id; // ID מה-JWT
        const ext = path.extname(file.originalname); // סיומת הקובץ
        cb(null, `${userId}${ext}`); // שם הקובץ: <userId>.<ext>
    },
});

const upload = multer({ storage });

// ראוט להעלאת קובץ
router.post("/upload", middleLog.authenticateToken, upload.single("file"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // עדכון טבלת files עם נתיב הקובץ
        const Query = `INSERT INTO files (routing, stage_id) VALUES (?, ?)`;
        const promisePool = db_pool.promise();
        const filePath = `/uploads/${req.user.id}${path.extname(req.file.originalname)}`;

        promisePool.query(Query, [filePath, req.body.stage_id || null])
            .then(() => {
                res.status(200).json({ message: "File uploaded successfully", filePath });
            })
            .catch((err) => {
                res.status(500).json({ message: "Database error", error: err.message });
            });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
*/
