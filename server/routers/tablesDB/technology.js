const express = require('express');
const router = express.Router();
module.exports = router;

const middleTech = require("../../middleware/tables/technology");
const middleLog = require("../../middleware/login - students/middleWareLogin");

// Get all technologies (RESTful)
router.get('/', middleLog.authenticateToken, middleTech.getTechnologies, (req, res) => {
    try {
        res.status(200).json({ success: true, data: res.technologyList });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת טכנולוגיות' });
    }
});
// Create a new technology (RESTful)
router.post('/', middleLog.authenticateToken, middleTech.addTechnology, (req, res) => {
    try {
        res.status(res.addStatus || 200).json({ success: res.addStatus === 200, message: res.addMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה ביצירת טכנולוגיה' });
    }
});
// Update a technology by ID (RESTful)
router.put('/:technologyId', middleLog.authenticateToken, middleTech.updateTechnology, (req, res) => {
    try {
        res.status(res.updateStatus || 200).json({ success: res.updateStatus === 200, message: res.updateMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בעדכון טכנולוגיה' });
    }
});
// Delete a technology by ID (RESTful)
router.delete('/:technologyId', middleLog.authenticateToken, middleTech.deleteTechnology, (req, res) => {
    try {
        res.status(res.deleteStatus || 200).json({ success: res.deleteStatus === 200, message: res.deleteMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה במחיקת טכנולוגיה' });
    }
});


