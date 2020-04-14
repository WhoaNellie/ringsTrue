const express = require("express");
const mongoose = require('mongoose');

const User = require("../models/Users");
const db = require("../models");
const keys = null;
 
if(!process.env.MONGODB_URI){
  keys = require("./apiKeys.js");
}

const router = express.Router();

let uristring =
    process.env.MONGODB_URI ||
    process.env.MONGOLAB_URI ||
    keys.mongoURI;

mongoose.connect(uristring, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

router.post("/api/register", async (req, res) => {
    try{
        let newUser = new User(req.body);
        let result = await newUser.save();
        res.send(result);
    }catch (err){
        res.status(500).send(err);
    } 
});

router.post("/api/login", async (req, res) => {
    try{
        let user = await User.findOne({ username: req.body.username }).exec();

        if(!user){
            console.log("bad un");
            return res.status(400).send({ message: "The username not registered" });
        }

        user.comparePassword(req.body.password, (err, match) => {
            if(!match) {
                res.status(400).send({ message: "The password is invalid" });
                return;
            }
            res.send({ message: "Logged in" });
            console.log("success?");
        });

        
    }catch(err){
        res.status(500).send(err);
    }
})

router.post("/api/rating", function (req, res) {
    db.Rating.create(req.body).then(function (response) {
        console.log(response);
    }).catch(function (err) {
        console.log(err);
    })
});

router.get("/api/network", function (req, res) {
    res.json(db.Network.findOne({
        name: req.body.name
    }).populate('ratings').exec(function (err, ratings) {
        if (err) throw err;

        console.log("populated", ratings);
    }))
});

module.exports = router;