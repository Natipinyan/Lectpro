const express = require("express");
const router = express.Router();
const middleLog = require("../../../middleware/login - instructor/middleWareLogin");

// REST: Instructor login
router.post('/', middleLog.check_login, (req, res) => {
    try {
        res.status(res.statusCodeToSend).json({
            success: res.statusCodeToSend === 200,
            ...res.responseData
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בהתחברות' });
    }
});

module.exports = router;