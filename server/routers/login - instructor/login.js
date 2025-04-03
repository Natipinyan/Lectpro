const express = require('express');
const router = express.Router();
module.exports = router;

const middleLog = require("../../middleware/login - instructor/middleWareLogin");

const jwt = require('jsonwebtoken');
const Cookies = require('js-cookie');


const jwtSecret = process.env.JWT_SECRET_KEY;

router.post("/chek", [middleLog.check_login], function (req, res, next) {
    if (res.loggedEn) {
        const token = jwt.sign({ userName: req.body.userName }, jwtSecret, { expiresIn: '1d' });

        res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 86400000 }); // 1 יום

        res.json({
            loggedIn: true,
            message: 'Login successful'
        });
    } else {
        res.json({
            loggedIn: false,
            message: 'Invalid credentials'
        });
    }
});
