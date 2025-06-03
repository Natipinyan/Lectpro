const express = require('express');
const router = express.Router();
module.exports = router;

const middleReg = require("../../../middleware/login - students/middleWewrRegister");
const middleLog = require("../../../middleware/login - students/middleWareLogin");

router.get("/List", middleReg.getList, (req, res) => {
    res.status(200).json(res.studentsList);
});

router.post("/Add", middleReg.Adduser, (req, res) => {
    res.status(res.addStatus).json({ message: res.addMessage });
});

router.post("/Update",middleLog.authenticateToken, middleReg.UpdateUser, (req, res) => {
    res.status(res.updateStatus || 200).json({ message: res.updateMessage });
});

router.delete("/Delete/:row_id", middleReg.delUser, (req, res) => {
    res.status(res.deleteStatus || 200).json({ message: res.deleteMessage });
});

router.get("/getUser",middleLog.authenticateToken, middleReg.getUser, (req, res) => {
    res.status(200).json(res.student);
});

router.post("/resetPass", middleReg.forgot_password, (req, res) => {
    res.status(200).json();
});

router.get("/upPass", middleReg.resetPassword, (req, res) => {
    res.status(200).json();
});
