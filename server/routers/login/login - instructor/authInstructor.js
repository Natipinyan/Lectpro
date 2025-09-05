const express = require("express");
const router = express.Router();
const middleLog = require("../../../middleware/login - instructor/middleWareLogin");
const middleRole = require("../../../middleware/role");

// REST: Check if instructor is admin
router.get('/', middleLog.checkAdmin, (req, res) => {
    try {
        res.status(200).json({ success: true, isAdmin: res.isAdmin });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בבדיקת מנהל' });
    }
});

// REST: Check instructor authentication
router.get('/check-auth', middleLog.authenticateToken, (req, res) => {
    try {
        res.status(200).json({ success: true, data: { isAuthenticated: true, user: req.user } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בבדיקת אימות' });
    }
});

// REST: Check authentication for external access (e.g., homepage)
router.get('/external-check-auth', middleLog.externalAuthenticate, (req, res) => {
    try {
        res.status(200).json({ success: true, data: { isAuthenticated: true, user: req.user } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to check authentication' });
    }
});

// REST: Instructor logout
router.post('/logout', middleLog.authenticateToken, (req, res) => {
    try {
        res.clearCookie("instructors", {
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


// REST: Check if instructor is associated with a specific project
router.get('/checkInstructor/:projectId',middleRole.getRole, middleLog.checkProjectInstructor, (req, res) => {
    try {
        res.status(200).json(res.checkProjectInstructor);
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בבדיקת מרצה הפרויקט' });
    }
});

module.exports = router;