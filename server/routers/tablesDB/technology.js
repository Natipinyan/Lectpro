const express = require('express');
const router = express.Router();
module.exports = router;

const middleTech = require("../../middleware/tables/technology");

router.get("/List", middleTech.getTechnologies, (req, res) => {
    res.status(200).json(res.technologyList);
});

router.post("/Add", middleTech.addTechnology, (req, res) => {
    res.status(res.addStatus || 200).json({ message: res.addMessage });
});

router.post("/update", middleTech.updateTechnology, (req, res) => {
    res.status(res.updateStatus || 200).json({ message: res.updateMessage });
});

router.delete("/delete", middleTech.deleteTechnology, (req, res) => {
    res.status(res.deleteStatus || 200).json({ message: res.deleteMessage });
});


