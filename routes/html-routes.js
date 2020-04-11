const express = require("express");
const router = express.Router();

router.get("/", function(req,res){
    res.send("get got!");
})

router.get("/register", function(req,res){
    res.sendFile(path.join(__dirname, "../public/test/register.html"));
})

module.exports = router;