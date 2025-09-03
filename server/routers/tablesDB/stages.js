const express = require('express');
const router = express.Router();
const middleStages = require("../../middleware/tables/stages");
const middleLogIns = require("../../middleware/login - instructor/middleWareLogin");
const middleLog = require("../../middleware/login - students/middleWareLogin");

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

// Get all stages and current stage for a specific project(instructor)
router.get('/ins/projectStages/:projectId', middleLogIns.authenticateToken, middleStages.getProjectStages, (req, res) => {
    res.status(200).json({
        success: true, data: {allStages: res.allStages, currentStage: res.currentStage}});
});

// Get all stages and current stage for a specific project(student)
router.get('/projectStages/:projectId', middleLog.authenticateToken, middleStages.getProjectStages, (req, res) => {
    res.status(200).json({
        success: true, data: {allStages: res.allStages, currentStage: res.currentStage}});
});

module.exports = router;
