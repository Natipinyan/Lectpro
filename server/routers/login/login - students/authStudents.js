const express = require("express");
const router = express.Router();
const middleLog = require("../../../middleware/login - students/middleWareLogin");

router.get("/check-auth", middleLog.authenticateToken, (req, res) => {
    res.status(200).json({ isAuthenticated: true, user: req.user });
});

router.post("/logout", middleLog.authenticateToken, (req, res) => {
    res.clearCookie("students", {
        httpOnly: true,
        secure: false, // change to true in production
        sameSite: "Lax",
    });

    res.status(200).json({
        loggedOut: true,
        message: "התנתקת בהצלחה",
    });
});

module.exports = router;