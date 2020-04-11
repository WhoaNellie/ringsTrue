const express = require("express");
const mongoose = require('mongoose');

const User = require("../models/Users");
const db = require("../models");
const keys = require("../apiKeys.js");

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

router.post("/api/register", (req, res) => {
    let newUser = new User(req.body);

    newUser.save(function (err) {
        if (err) throw err;
    });
});

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