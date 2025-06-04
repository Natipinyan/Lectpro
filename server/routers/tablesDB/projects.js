const express = require("express");
const router = express.Router();
const middleLog = require("../../middleware/login - students/middleWareLogin");
const middlePro = require("../../middleware/projects/middle_Projects");

const path = require('path');
const fs = require('fs');


router.post('/addproject', middleLog.authenticateToken, middlePro.addProject, (req, res) => {
    //console.log("Authenticated user:", req.user);
    return res.status(200).json({ message: "הפרויקט התקבל בהצלחה!" });
});
router.get('/list', middleLog.authenticateToken, middlePro.getProjects, (req, res) => {
    res.status(200).json(res.projectsList);
});

router.get('/getOneProject/:projectId', middleLog.authenticateToken, middlePro.getOneProject, (req, res) => {
    res.status(200).json(res.project);
});

router.get('/getProjectTechnologies/:projectId', middleLog.authenticateToken, middlePro.getProjectTechnologies, (req, res) => {
    res.status(200).json(res.technologies);
});

router.get('/file/:projectId', middleLog.authenticateToken, (req, res) => {
    console.log("Request for file with projectId:", req.params.projectId);
    const projectId = req.params.projectId;
    const fileName = `1_19.05.2025.pdf`;
    const filePath = path.join(__dirname, '..', '..', 'filesApp', fileName);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'הקובץ לא נמצא' });
    }

    const studentId = req.user.id;
    const q = `SELECT * FROM projects WHERE id = ? AND student_id1 = ?;`;

    db_pool.query(q, [projectId, studentId], (err, rows) => {
        if (err) {
            console.error('שגיאה בשליפת הפרויקט:', err);
            return res.status(500).json({ message: 'שגיאה בשליפת הפרויקט' });
        }
        if (rows.length === 0) {
            return res.status(403).json({ message: 'אין לך הרשאה לגשת לקובץ זה' });
        }

        // הגשת הקובץ
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('שגיאה בהגשת הקובץ:', err);
                return res.status(500).json({ message: 'שגיאה בהגשת הקובץ' });
            }
        });
    });
});



module.exports = router;