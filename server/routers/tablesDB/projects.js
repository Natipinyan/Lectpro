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



module.exports = router;