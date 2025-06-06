const express = require("express");
const router = express.Router();
const middleLog = require("../../../middleware/login - instructor/middleWareLogin");

router.post("/check", middleLog.check_login, (req, res) => {
    if (res.loggedEn) {
        res.status(200).json({
            loggedIn: true,
            message: "Login successful",
            user: { id: req.user.id, userName: req.user.user_name },
        });
    } else {
        res.status(401).json({
            loggedIn: false,
            message: res.message || "Invalid credentials",
        });
    }
});

module.exports = router;