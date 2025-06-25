const express = require('express');
const router = express.Router();
const { sendEmailFromApi } = require('../../middleware/Email/Email');

// REST: Send email
router.post('/', sendEmailFromApi);

module.exports = router;