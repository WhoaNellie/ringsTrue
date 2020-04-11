const express = require("express");
const mongoose = require('mongoose');

const User = require("../models/Users");
const db = require("../models");
const keys = require("../apiKeys.js");

let uristring =
    process.env.MONGODB_URI ||
    process.env.MONGOLAB_URI ||
    keys.mongoURI;

mongoose.connect(uristring, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

const router = express.Router();

router.post("/api/register", (req, res) => {
    let newUser = new User(req.body);

    newUser.save(function (err) {
        if (err) throw err;

        // fetch user and test password verification
        User.findOne({
            username: 'testun'
        }, function (err, user) {
            if (err) throw err;

            // test a matching password
            user.comparePassword('testpw', function (err, isMatch) {
                if (err) throw err;
                console.log('testpw:', isMatch); // -> Password123: true
            });

            // test a failing password
            user.comparePassword('123Password', function (err, isMatch) {
                if (err) throw err;
                console.log('123Password:', isMatch); // -> 123Password: false
            });
        });
    });
});

module.exports = router;