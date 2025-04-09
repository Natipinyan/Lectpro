const express = require('express');
const router = express.Router();
module.exports = router;

const middleLog = require("../../middleware/login - students/middleWareLogin");

const jwt = require('jsonwebtoken');
const Cookies = require('js-cookie');


const jwtSecret = process.env.JWT_SECRET_KEY;

router.post("/chek", middleLog.check_login, (req, res) => {
    if (res.loggedEn) {
        res.status(200).json({
            loggedIn: true,
            message: 'Login successful'
        });
    } else {
        res.status(401).json({
            loggedIn: false,
            message: res.message || 'Invalid credentials'
        });
    }
});