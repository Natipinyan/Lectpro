const express = require('express');
const router = express.Router();
const middleStages = require("../../middleware/tables/stages");
const middleLogIns = require("../../middleware/login - instructor/middleWareLogin");
const middleLog = require("../../middleware/login - students/middleWareLogin");
const middleRole = require("../../services/role");
const middleResponse = require("../../middleware/response");

// REST: Get all stages department (only department manager)
router.get('/',
    middleRole.getRole,
    middleStages.getStagesByDepartment,
    (req, res) => {
        middleResponse.sendResponse(res);
    }
);

// REST: Add new stage (only department manager)
router.post(
    '/',
    middleRole.getRole,
    middleStages.addStageByDepartment,
    (req, res) => {
        middleResponse.sendResponse(res);
    }
);


// Update stage (administrator)
router.put('/:stageId', middleLogIns.authenticateToken, middleLogIns.ensureAdmin, middleStages.updateStage, (req, res) => {
    res.status(res.updateStatus || 200).json({ success: res.updateStatus === 200, message: res.updateMessage });
});

// Delete stage (administrator)
router.delete('/:stageId', middleLogIns.authenticateToken, middleLogIns.ensureAdmin, middleStages.deleteStage, (req, res) => {
    res.status(res.deleteStatus || 200).json({ success: res.deleteStatus === 200, message: res.deleteMessage });
});

// Get all stages and current stage for a specific project (instructor and student)
router.get('/projectStages/:projectId',
    middleRole.getRole,
    middleStages.getProjectStages,
    (req, res) => {
        middleResponse.sendResponse(res);
    }
);

// Update current stage for a specific project(instructor only)
router.put('/updateProjectStage/:projectId', middleRole.getRole, middleStages.updateProjectStage, (req, res) => {
    res.status(res.updateStatus || 200).json({success: res.updateStatus === 200, message: res.updateMessage});
});

// REST: approve Upload file for a project (instructor only)
router.post(
    '/approveDocument/:projectId',
    middleRole.getRole,
    middleStages.approveDocument,
    (req, res) => {
        middleResponse.sendResponse(res);
    }
);


module.exports = router;
