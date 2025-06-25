const express = require('express');
const router = express.Router();
const { sendEmailFromApi } = require('../../middleware/Email/Email');

// Send email (RESTful)
router.post('/', sendEmailFromApi);

module.exports = router;