const express = require('express');
const router = express.Router();
module.exports = router;

const middleComments = require("../../middleware/tables/comments");
const middleLog = require("../../middleware/login - students/middleWareLogin");
const middleLogIns = require("../../middleware/login - instructor/middleWareLogin");
const middleRole = require("../../middleware/role");
const middleResponse = require("../../middleware/response");

// REST: Get comments by project ID (for student)
router.get('/project/:projectId',
    middleRole.getRole,
    middleComments.getCommentsByProject,
    (req, res) => {
        middleResponse.sendResponse(res);
    }
);

// REST: Get one comment by ID (for instructor)
router.get('/:commentId',
    middleRole.getRole,
    middleComments.getCommentById,
    (req, res) => {
        middleResponse.sendResponse(res);
    }
);



// REST: Get next comment by ID (for student)
router.get('/next/:commentId',  middleRole.getRole, middleComments.getNextComment, (req, res) => {
    try {
        res.status(req.nextStatus || 200).json({success: req.nextSuccess, message: req.nextMessage, data: req.nextComment || null});
    } catch (err) {
        res.status(500).json({success: false, message: 'שגיאה בקבלת ההערה הבאה'
        });
    }
});

// REST: Get previous comment by ID (for student)
router.get('/prev/:commentId',  middleRole.getRole, middleComments.getPrevComment, (req, res) => {
    try {
        res.status(req.prevStatus || 200).json({success: req.prevSuccess, data: req.prevComment || null});
    } catch (err) {
        res.status(500).json({success: false, message: 'שגיאה בקבלת ההערה הקודמת'
        });
    }
});


// REST: Create a new comment (for instructor)
router.post('/',
    middleRole.getRole,
    middleComments.addComment,
    (req, res) => {
        middleResponse.sendResponse(res);
    }
);


// REST: Update a comment by ID (for instructor)
router.put(
    '/:commentId',
    middleLogIns.authenticateToken,
    middleRole.getRole,
    middleComments.updateComment,
    (req, res) => {
        middleResponse.sendResponse(res);
    }
);


// REST: Update a comment to be done (for instructor)
router.put('/isDone/:commentId',middleRole.getRole, middleComments.setCommentDone, (req, res) => {
    try {
        res.status(res.updateStatus || 200).json({success: res.updateStatus === 200, message: res.updateMessage});
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בעדכון הערה' });
    }
});

// REST: User marks comment done with response (for student)
router.put('/:commentId/userDone', middleRole.getRole, middleComments.markDoneByUser, (req, res) => {
    try {
        res.status(res.updateStatus || 200).json({ success: res.updateStatus === 200, message: res.updateMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בעדכון תגובת המשתמש' });
    }
});

// REST: Delete a comment by ID (for instructor)
router.delete('/:commentId', middleRole.getRole, middleComments.deleteComment, (req, res) => {
    try {
        res.status(res.deleteStatus || 200).json({ success: res.deleteStatus === 200, message: res.deleteMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה במחיקת הערה' });
    }
});
