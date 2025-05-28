const express = require('express');
const router = express.Router();
const middleMail = require('../../middleware/Email/Email');

router.post('/', [middleMail.getData], function (req, res, next) {
    // הקוד כאן מיותר כי הפונקציה נמצאת ב-middleware
});

module.exports = router;