const express = require('express');
const router = express.Router();
const middleRole = require("../../middleware/role");
const middleNotification = require("../../middleware/tables/notification");

router.get('/', middleRole.getRole,middleNotification.getNotifications, async (req, res) => {
    try {
        return res.json(res.locals.data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'שגיאה בשליחת ההתראות' });
    }
});

module.exports = router;
