const express = require('express');
const router = express.Router();
module.exports = router;

const middleComments = require("../../middleware/tables/comments");
const middleLog = require("../../middleware/login - students/middleWareLogin");
const middleLogIns = require("../../middleware/login - instructor/middleWareLogin");

// REST: Get all comments
router.get('/', middleLogIns.authenticateToken, middleComments.getComments, (req, res) => {
    try {
        res.status(200).json({ success: true, data: res.commentsList });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת הערות' });
    }
});




// REST: Get one comment by ID (for instructor)
router.get('/ins/:commentId', middleLogIns.authenticateToken, middleComments.getCommentById,(req, res) => {
    try {
        res.status(200).json({ success: true, data: res.commentData });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת הערות עבור הפרויקט' });
    }
});

// REST: Get one comment by ID (for instructor)
router.get('/:commentId', middleLog.authenticateToken, middleComments.getCommentById,(req, res) => {
    try {
        res.status(200).json({ success: true, data: res.commentData });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת הערות עבור הפרויקט' });
    }
});


// REST: Get next comment by ID (for instructor)
router.get('/ins/next/:commentId', middleLogIns.authenticateToken, middleComments.getNextComment, (req, res) => {
    try {
        res.status(req.nextStatus || 200).json({success: req.nextSuccess, message: req.nextMessage, data: req.nextComment || null});
    } catch (err) {
        res.status(500).json({success: false, message: 'שגיאה בקבלת ההערה הבאה'
        });
    }
});

// REST: Get previous comment by ID (for instructor)
router.get('/ins/prev/:commentId', middleLogIns.authenticateToken, middleComments.getPrevComment, (req, res) => {
    try {
        res.status(req.prevStatus || 200).json({success: req.prevSuccess, data: req.prevComment || null});
    } catch (err) {
        res.status(500).json({success: false, message: 'שגיאה בקבלת ההערה הקודמת'
        });
    }
});




// REST: Get comments by project ID (for instructor)
router.get('/ins/project/:projectId', middleLogIns.authenticateToken, middleComments.getCommentsByProject, (req, res) => {
    try {
        res.status(200).json({ success: true, data: res.commentsList });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת הערות עבור הפרויקט' });
    }
});

// REST: Get comments by project ID (for student)
router.get('/project/:projectId', middleLog.authenticateToken, middleComments.getCommentsByProject, (req, res) => {
    try {
        res.status(200).json({ success: true, data: res.commentsList });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בקבלת הערות עבור הפרויקט' });
    }
});

// REST: Create a new comment (for instructor)
router.post('/', middleLogIns.authenticateToken, middleComments.addComment, (req, res) => {
    try {
        res.status(res.addStatus || 200).json({ success: res.addStatus === 200, message: res.addMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה ביצירת הערה' });
    }
});

// REST: Update a comment by ID (for instructor)
router.put('/:commentId', middleLogIns.authenticateToken, middleComments.updateComment, (req, res) => {
    try {
        res.status(res.updateStatus || 200).json({ success: res.updateStatus === 200, message: res.updateMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בעדכון הערה' });
    }
});

// REST: Update a comment to be done (for instructor)
router.put('/isDone/:commentId', middleLogIns.authenticateToken, middleComments.setCommentDone, (req, res) => {
    try {
        res.status(res.updateStatus || 200).json({success: res.updateStatus === 200, message: res.updateMessage});
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בעדכון הערה' });
    }
});

// REST: User marks comment done with response (for student)
router.put('/:commentId/userDone', middleLog.authenticateToken, middleComments.markDoneByUser, (req, res) => {
    try {
        res.status(res.updateStatus || 200).json({ success: res.updateStatus === 200, message: res.updateMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה בעדכון תגובת המשתמש' });
    }
});

// REST: Delete a comment by ID (for instructor)
router.delete('/:commentId', middleLogIns.authenticateToken, middleComments.deleteComment, (req, res) => {
    try {
        res.status(res.deleteStatus || 200).json({ success: res.deleteStatus === 200, message: res.deleteMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'שגיאה במחיקת הערה' });
    }
});
