const express = require("express");
const router = express.Router();
const middleLog = require("../../../middleware/login - students/middleWareLogin");

// Student login (RESTful)
router.post('/', middleLog.check_login, (req, res) => {
    res.status(res.statusCodeToSend).json(res.responseData);
});



module.exports = router;
