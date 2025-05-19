const express = require("express");
const router = express.Router();
const middleLog = require("../../../middleware/login - instructor/middleWareLogin");

router.get("/check-auth", middleLog.authenticateToken, (req, res) => {
    res.status(200).json({ isAuthenticated: true, user: req.user });
});

module.exports = router;