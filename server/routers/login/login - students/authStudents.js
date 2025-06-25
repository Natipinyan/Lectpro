const express = require("express");
const router = express.Router();
const middleLog = require("../../../middleware/login - students/middleWareLogin");

// Check student authentication (RESTful)
router.get('/check-auth', middleLog.authenticateToken, (req, res) => {
    try {
        res.status(200).json({ success: true, data: { isAuthenticated: true, user: req.user } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בבדיקת אימות' });
    }
});

// Check authentication for external access (e.g., homepage)
router.get('/external-check-auth', middleLog.externalAuthenticate, (req, res) => {
    try {
        res.status(200).json({ success: true, data: { isAuthenticated: true, user: req.user } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to check authentication' });
    }
});

// Student logout (RESTful)
router.post('/logout', middleLog.authenticateToken, (req, res) => {
    try {
        res.clearCookie("students", {
            httpOnly: true,
            secure: false, // change to true in production
            sameSite: "Lax",
        });
        res.status(200).json({
            success: true,
            message: "התנתקת בהצלחה",
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה ביציאה מהמערכת' });
    }
});



module.exports = router;