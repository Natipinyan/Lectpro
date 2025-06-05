const express = require("express");
const router = express.Router();
const middleLog = require("../../middleware/login - students/middleWareLogin");
const middlePro = require("../../middleware/projects/middle_Projects");

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

router.get('/file/:projectId', middleLog.authenticateToken, middlePro.getProjectFile, (req, res) => {
    res.sendFile(res.filePath, (err) => {
        if (err) {
            console.error('שגיאה בהגשת הקובץ:', err);
            return res.status(500).json({ message: 'שגיאה בהגשת הקובץ' });
        }
    });
});



module.exports = router;