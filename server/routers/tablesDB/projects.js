const express = require("express");
const router = express.Router();
const middleLog = require("../../middleware/login - students/middleWareLogin");
const middlePro = require("../../middleware/projects/middle_Projects");


router.post('/addproject', middleLog.authenticateToken, middlePro.addProject, (req, res) => {
    console.log("Authenticated user:", req.user);
    return res.status(200).json({ message: "הפרויקט התקבל בהצלחה!" });
});

module.exports = router;