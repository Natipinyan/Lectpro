const multer = require('multer');
const path = require('path');
const fs = require('fs');
const middleRole = require("../role");


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
        const projectTitle = req.body.projectTitle || 'unnamed_project';
        const ext = path.extname(req.file.originalname);

        const cleanProjectTitle = projectTitle.replace(/[^a-zA-Z0-9א-ת_-]/g, '_');
        const newFileName = `${cleanProjectTitle}${ext}`;
        const newPath = path.join(req.file.destination, newFileName);

        await fs.promises.rename(oldPath, newPath);

        const filePath = `/uploads/${newFileName}`;

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

const storageWord = multer.memoryStorage();
const storageSignature = multer.memoryStorage();

const uploadTwoFiles = multer().fields([
    { name: 'proposal', maxCount: 1 },
    { name: 'signature', maxCount: 1 }
]);

const handleTwoFileUpload = async (req, res, next) => {
    const projectId = req.params.projectId;
    const userId = req.user?.id;
    const type = req.user?.role;
    const accessInfo = await middleRole.checkUserProjectAccess(userId, type, projectId);

    if (!accessInfo.hasAccess || accessInfo.role !== 'student') {
        return res.status(403).json({
            success: false,
            message: "אין לך הרשאה להעלות קבצים לפרויקט זה"
        });
    }


    try {
        const projectId = req.params.projectId;
        if (!projectId) {
            return res.status(400).json({ success: false, message: "לא נמצא מזהה פרויקט תקין" });
        }

        if (!req.files || !req.files.proposal || !req.files.signature) {
            return res.status(400).json({ success: false, message: "אנא העלה את שני הקבצים" });
        }

        const wordFile = req.files.proposal[0];
        const signatureFile = req.files.signature[0];

        const wordExt = path.extname(wordFile.originalname);
        const wordName = `${projectId}${wordExt}`;
        const wordPath = path.join('server/wordFilesApp', wordName);
        await fs.promises.writeFile(wordPath, wordFile.buffer);

        const signatureExt = path.extname(signatureFile.originalname);
        const signatureName = `${projectId}${signatureExt}`;
        const signaturePath = path.join('server/signatureImgApp', signatureName);
        await fs.promises.writeFile(signaturePath, signatureFile.buffer);

        req.uploadResult = {
            message: "שני הקבצים הועלו בהצלחה!",
        };

        next();
    } catch (err) {
        console.error("שגיאת שרת ב-handleTwoFileUpload:", err);
        return res.status(500).json({ success: false, message: "שגיאת שרת", error: err.message });
    }
};

module.exports = {
    upload,
    handleFileUpload,
    handleTwoFileUpload,
    uploadTwoFiles
};