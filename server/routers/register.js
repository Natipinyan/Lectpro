const express = require('express');
const router = express.Router();
module.exports = router;

const middleReg = require("../middleware/middleWewrRegister");

router.get("/List", [middleReg.getList], function (req, res) {
});

router.post("/Add", [middleReg.Adduser], function (req, res) {
});

router.post("/Update", [middleReg.UpdateUser], function (req, res) {
});

router.delete("/Delete/:row_id", [middleReg.delUser], function (req, res) {
});
