const multer = require('multer');
const path = require('path');
const fs = require('fs');
const middleRole = require("../role");
const addNotification = require("../../services/notificationsService").addNotification;



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
    const type = req.user?.role;
    const userId = req.user?.id;
    const projectId = req.params.projectId;

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

        try {
            const [results] = await db_pool.promise().query(
                'SELECT title, instructor_id, department_id FROM projects WHERE id = ?',
                [projectId]
            );

            if (results.length > 0) {
                const { title: projectName, instructor_id, department_id } = results[0];

                await addNotification(
                    userId,
                    type,
                    'מסמך הפרויקט עלה בהצלחה',
                    `מסמך הפרויקט ${projectName} הועלה בהצלחה למערכת.`,
                    'system',
                    projectId
                ).catch(err => console.error('שגיאה ביצירת התראה לסטודנט:', err));

                if (instructor_id) {
                    await addNotification(
                        instructor_id,
                        'instructor',
                        'מסמך פרויקט הועלה',
                        `סטודנט העלה מסמך חדש לפרויקט ${projectName}.`,
                        'system',
                        projectId
                    ).catch(err => console.error('שגיאה ביצירת התראה למנחה:', err));
                }

                const [admins] = await db_pool.promise().query(
                    `SELECT id FROM instructor WHERE department_id = ? AND is_admin = 1`,
                    [department_id]
                );

                for (const admin of admins) {
                    await addNotification(
                        admin.id,
                        'admin',
                        'מסמך פרויקט הועלה',
                        `סטודנט העלה מסמך חדש לפרויקט ${projectName}.`,
                        'system',
                        projectId
                    ).catch(err => console.error('שגיאה ביצירת התראה למנהל מגמה:', err));
                }
            }
        } catch (err) {
            console.error('שגיאה בטעינת נתוני הפרויקט/שליחת התראות:', err);
        }


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

    if (!projectId) {
        return res.status(400).json({ success: false, message: "לא נמצא מזהה פרויקט תקין" });
    }

    if (!accessInfo.hasAccess || accessInfo.role !== 'student') {
        return res.status(403).json({
            success: false,
            message: "אין לך הרשאה להעלות קבצים לפרויקט זה"
        });
    }

    const [rows] = await db_pool.promise().query(
        "SELECT * FROM projects WHERE id = ?",
        [projectId]
    );

    if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "הפרויקט לא נמצא" });
    }

    const project = rows[0];

    if (project.status !== 1) {
        return res.status(400).json({ success: false, message: "סטטוס הפרויקט אינו מאפשר העלאה" });
    }

    try {
        if (!req.files || !req.files.proposal || !req.files.signature) {
            return res.status(400).json({ success: false, message: "אנא העלה את שני הקבצים" });
        }

        const wordFile = req.files.proposal[0];
        const signatureFile = req.files.signature[0];

        const allowedWordExt = ['.doc', '.docx'];
        const wordExt = path.extname(wordFile.originalname).toLowerCase();
        if (!allowedWordExt.includes(wordExt)) {
            return res.status(400).json({ success: false, message: "קובץ הצעה חייב להיות Word (.doc או .docx)" });
        }

        const allowedImageExt = ['.png', '.jpg', '.jpeg'];
        const signatureExt = path.extname(signatureFile.originalname).toLowerCase();
        if (!allowedImageExt.includes(signatureExt)) {
            return res.status(400).json({ success: false, message: "דוגמת חתימה חייבת להיות תמונה (.png, .jpg, .jpeg )" });
        }

        const wordName = `${projectId}${wordExt}`;
        const wordPath = path.join('server/wordFilesApp', wordName);
        await fs.promises.writeFile(wordPath, wordFile.buffer);

        const signatureName = `${projectId}${signatureExt}`;
        const signaturePath = path.join('server/signatureImgApp', signatureName);
        await fs.promises.writeFile(signaturePath, signatureFile.buffer);

        if (project.instructor_id) {
            await addNotification(
                project.instructor_id,
                'instructor',
                'סטודנט העלה מסמך',
                `בפרויקט "${project.title}" הסטודנט העלה מסמך פרויקט בוורד ודוגמת חתימה.`,
                'system',
                projectId
            ).catch(err => console.error('שגיאה בשליחת התראה למרצה:', err));
        }

        db_pool.query(
            "SELECT id FROM instructor WHERE department_id = ? AND is_admin = 1",
            [project.department_id],
            (err, admins) => {
                if (err) return console.error('שגיאה בשליחת התראה למנהל:', err);

                admins.forEach(admin => {
                    addNotification(
                        admin.id,
                        'admin',
                        'סטודנט העלה מסמך',
                        `בפרויקט "${project.title}" הסטודנט "${req.user.first_name} ${req.user.last_name}" העלה מסמך פרויקט בוורד ודוגמת חתימה.`,
                        'system',
                        projectId
                    ).catch(err => console.error('שגיאה בשליחת התראה למנהל:', err));
                });
            }
        );

        req.uploadResult = { message: "שני הקבצים הועלו בהצלחה!" };
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