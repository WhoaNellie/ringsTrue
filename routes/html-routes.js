const express = require("express");
const router = express.Router();

    router.get("/", function(req,res){
        res.send("get got!");
    })

module.exports = router;