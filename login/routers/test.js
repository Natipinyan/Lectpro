const express = require('express');
const router = express.Router();
module.exports = router;

const middle=require("../middleware/middleWareLogin");

router.get("/page1",(req, res) => {
    res.render("cookiesTest", {pageTitle:"cookies work"});
});

router.get("/page2",(req, res) => {
    res.render("cookiesTestDouble", {pageTitle:"cookies work"});
});