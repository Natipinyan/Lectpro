const express = require('express');
const router = express.Router();


const login_rtr = require('./login - instructor/login');
router.use('/login', login_rtr);

const register_rtr = require('./login - instructor/register');
router.use('/register', register_rtr);

module.exports = router;
