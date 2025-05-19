const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/filesApp/');
    },
    filename: (req, file, cb) => {
        const userId = req.user.id;
        const now = new Date();

        const formattedDate = now.toLocaleDateString('he-IL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/[\/\s:]/g, '-').replace('-', '_').replace(':', '_').replace(',', '');

        const ext = path.extname(file.originalname);
        cb(null, `${userId}_${formattedDate}${ext}`);
    }
});

const upload = multer({ storage: storage });

const handleFileUpload = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "לא נשלח קובץ" });
        }

        const filePath = `/uploads/${req.file.filename}`;
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
        return res.status(500).json({ message: "שגיאת שרת", error: err.message });
    }
};

module.exports = {
    upload,
    handleFileUpload
};
