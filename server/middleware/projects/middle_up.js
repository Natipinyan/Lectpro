const multer = require('multer');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/filesApp/');
    },
    filename: (req, file, cb) => {
        const userId = req.user.id;
        const ext = path.extname(file.originalname);
        cb(null, `${userId}_${ext}`);
    }
});

const upload = multer({ storage: storage });

const handleFileUpload = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "לא נשלח קובץ" });
        }

        const oldPath = req.file.path;
        const userId = req.user.id;

        const projectTitle = req.body.projectTitle || 'unnamed_project';
        const ext = path.extname(req.file.originalname);

        const cleanProjectTitle = projectTitle.replace(/[^a-zA-Z0-9א-ת_-]/g, '_');
        const newFileName = `${cleanProjectTitle}${ext}`;
        const newPath = path.join(req.file.destination, newFileName);

        await fs.promises.rename(oldPath, newPath);

        const filePath = `/uploads/${newFileName}`;
        const stageId = req.body.stage_id || null;

        const Query = `INSERT INTO files (routing, stage_id) VALUES (?, ?)`;
        const promisePool = db_pool.promise();

        await promisePool.query(Query, [filePath, stageId]);

        req.uploadResult = {
            message: "הקובץ הועלה בהצלחה!",
            filePath
        };

        next();
    } catch (err) {
        console.error("שגיאת שרת ב-handleFileUpload:", err);
        return res.status(500).json({ message: "שגיאת שרת", error: err.message });
    }
};
module.exports = {
    upload,
    handleFileUpload
};