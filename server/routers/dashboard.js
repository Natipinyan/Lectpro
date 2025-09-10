const express = require("express");
const router = express.Router();
const {sendResponse} = require("../middleware/response");
const middleDash = require("../middleware/dashboard");
const middleLog = require("../middleware/login - instructor/middleWareLogin");
const middleRole = require("../services/role");

router.get(
    "/",
    middleLog.authenticateToken,
    middleRole.getRole,
    middleDash.getInstructorDashboard, (req, res) => sendResponse(res)
);

module.exports = router;
