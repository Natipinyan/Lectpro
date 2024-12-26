const express = require('express');
const router = express.Router();
module.exports = router;

const middleLog=require("../middleware/middleWareLogin");

router.get("/",(req, res) => {
    res.render("login", {pageTitle:"login page"});
});

router.post("/chek",[middleLog.check_login],function (req,res,next){
    if(res.loggedEn) {
        res.render("pageOneOfWebsit", {pageTitle:"websit first page"});
    } else {
        res.render("login", {pageTitle:"login page"}); }
});
