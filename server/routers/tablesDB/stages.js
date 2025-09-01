const express = require('express');
const router = express.Router();
const middleStages = require("../../middleware/tables/stages");
const middleLogIns = require("../../middleware/login - instructor/middleWareLogin");

// Get all stages for user's department
router.get('/', middleLogIns.authenticateToken, middleStages.getStages, (req, res) => {
    res.status(200).json({ success: true, data: res.stagesList });
});

// Add new stage (administrator)
router.post('/', middleLogIns.authenticateToken, middleLogIns.ensureAdmin, middleStages.addStage, (req, res) => {
    res.status(res.addStatus || 200).json({ success: res.addStatus === 200, message: res.addMessage });
});

// Update stage (administrator)
router.put('/:stageId', middleLogIns.authenticateToken, middleLogIns.ensureAdmin, middleStages.updateStage, (req, res) => {
    res.status(res.updateStatus || 200).json({ success: res.updateStatus === 200, message: res.updateMessage });
});

// Delete stage (administrator)
router.delete('/:stageId', middleLogIns.authenticateToken, middleLogIns.ensureAdmin, middleStages.deleteStage, (req, res) => {
    res.status(res.deleteStatus || 200).json({ success: res.deleteStatus === 200, message: res.deleteMessage });
});

module.exports = router;
