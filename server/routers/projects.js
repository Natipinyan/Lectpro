const express = require("express");
const router = express.Router();
const middlePro = require("../middleware/middle_Projects");
const middleReg = require("../middleware/login - instructor/middleWewrRegister");

router.post('/addproject', middlePro.addProject, (req, res) => {
    return res.status(200).json({ message: "הפרויקט התקבל בהצלחה!" });
});

module.exports = router;
