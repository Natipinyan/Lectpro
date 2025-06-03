const express = require("express");
const router = express.Router();
const middleLog = require("../../../middleware/login - students/middleWareLogin");

router.post("/check", middleLog.check_login, (req, res) => {
    res.status(res.statusCodeToSend).json(res.responseData);
});

module.exports = router;
