const express = require('express');
const router = express.Router();
module.exports = router;

const middleReg = require("../../../middleware/login - instructor/middleWewrRegister");

router.get("/List", middleReg.getList, (req, res) => {
    res.status(200).json(res.teachersList);
});

router.post("/Add", middleReg.AddUser, (req, res) => {
    res.status(res.addStatus || 200).json({ message: res.addMessage });
});

router.post("/Update", middleReg.UpdateUser, (req, res) => {
    res.status(res.updateStatus || 200).json({ message: res.updateMessage });
});

router.delete("/Delete/:row_id", middleReg.delUser, (req, res) => {
    res.status(res.deleteStatus || 200).json({ message: res.deleteMessage });
});
