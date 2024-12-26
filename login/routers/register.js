const express = require('express');
const {response} = require("express");
const router = express.Router();
module.exports = router;

const middleLog=require("../middleware/middleWareLogin");
const middleReg=require("../middleware/middleWewrRegister");

router.get("/",(req, res) => {
    res.render("registerPage", {pageTitle:"registerPage"});
});

router.post("/List",[middleReg.getList],function (req,res,next){
});

router.post("/Add",[middleReg.Adduser],function (req,res,next){
});

router.post("/Update",[middleReg.UpdateUser],function(req, res,next ){
});

router.delete("/Delete/:row_id",[middleReg.delUser],function (req, res,next){
});

