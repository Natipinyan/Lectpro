const express = require('express');
const router = express.Router();
module.exports = router;

const middleTech = require("../../middleware/tables/technology");
const middleLog = require("../../middleware/login - students/middleWareLogin");

// Get all technologies (RESTful)
router.get('/', middleLog.authenticateToken, middleTech.getTechnologies, (req, res) => {
    res.status(200).json(res.technologyList);
});
// Create a new technology (RESTful)
router.post('/', middleLog.authenticateToken, middleTech.addTechnology, (req, res) => {
    res.status(res.addStatus || 201).json({ message: res.addMessage });
});
// Update a technology by ID (RESTful)
router.put('/:technologyId', middleLog.authenticateToken, middleTech.updateTechnology, (req, res) => {
    res.status(res.updateStatus || 200).json({ message: res.updateMessage });
});
// Delete a technology by ID (RESTful)
router.delete('/:technologyId', middleLog.authenticateToken, middleTech.deleteTechnology, (req, res) => {
    res.status(res.deleteStatus || 200).json({ message: res.deleteMessage });
});


