const express = require("express");
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');

const User = require("../models/Users");
const db = require("../models");
let keys = null;

if (!process.env.MONGODB_URI) {
    keys = require("../apiKeys.js");
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

//check if login cookie is valid
router.post("/api/cookie", (req, res) => {
    console.log('Cookies: ', req.signedCookies)

    db.User.findById(req.signedCookies.user).then((user) => {
        console.log(user);
        if (user) {
            res.send({
                dailyRated: user.dailyRated
            });
        } else {
            res.end();
        }
    })
});

//get scrubbed articles
router.get("/api/articles", (req, res) => {
    db.Article.find({}).then((articles) => {
        res.send(articles);
    })
})

const commonPws = ["123456", "password", "12345678", "qwerty", "123456789", "12345", "1234", "111111", "1234567", "dragon", "123123", "baseball", "abc123", "football", "monkey", "letmein", "696969", "shadow", "master", "666666", "qwertyuiop", "123321", "mustang", "1234567890", "michael", "654321", "pussy", "superman", "1qaz2wsx", "7777777", "fuckyou", "121212", "000000", "qazwsx", "123qwe", "killer", "trustno1", "jordan", "jennifer", "zxcvbnm", "asdfgh", "hunter", "buster", "soccer", "harley", "batman", "andrew", "tigger", "sunshine", "iloveyou", "fuckme", "2000", "charlie", "robert", "thomas", "hockey", "ranger", "daniel", "starwars", "klaster", "112233", "george", "asshole", "computer", "michelle", "jessica", "pepper", "1111", "zxcvbn", "555555", "11111111", "131313", "freedom", "777777", "pass", "fuck", "maggie", "159753", "aaaaaa", "ginger", "princess", "joshua", "cheese", "amanda", "summer", "love", "ashley", "6969", "nicole", "chelsea", "biteme", "matthew", "access", "yankees", "987654321", "dallas", "austin", "thunder", "taylor", "matrix"];
//register new user and send cookie
router.post("/api/register", async (req, res) => {
    try {
        let oldUser = await db.User.find({
            username: req.body.username
        });

        if (oldUser.length === 0) {
            if (req.body.username.length >= 6 &&
                req.body.password.length >= 8 &&
                req.body.password === req.body.confirm &&
                !commonPws.includes(req.body.password)) {
                try {
                    let newUser = new User(req.body);
                    let result = await newUser.save();
                    res.cookie('user', result._id, {
                        signed: true
                    });
                    res.send(result);

                } catch (err) {
                    res.status(500).send(err);
                    res.end();
                }
            } else {
                if (req.body.username.length < 6) {
                    res.status(401).send({
                        message: "Username must be at least 6 characters."
                    });
                    res.end();
                }
                if (req.body.password.length < 8) {
                    res.status(401).send({
                        message: "Password must be at least 8 characters."
                    });
                    res.end();
                }
                if (req.body.password != req.body.confirm) {
                    res.status(401).send({
                        message: "Passwords do not match."
                    });
                    res.end();
                }
                if (commonPws.includes(req.body.password)) {
                    res.status(401).send({
                        message: "Password is in the top 100 most common."
                    });
                    res.end();
                }
            }


        } else {
            res.status(401).send({
                message: "That Username Has Already Been Taken"
            });
            return;
        }
    } catch (err) {
        res.status(500).send(err);
    }

});

//login and send cookie
router.post("/api/login", async (req, res) => {
    try {
        let user = await User.findOne({
            username: req.body.username
        }).exec();

        if (!user) {
            return res.status(400).send({
                message: "Username not registered."
            });
        }

        user.comparePassword(req.body.password, (err, match) => {
            if (!match) {
                res.status(401).send({
                    message: "Password is invalid."
                });
                return;
            }
            res.cookie('user', user._id, {
                signed: true
            });
            res.status(200).send({
                dailyRated: user.dailyRated
            });
        });


    } catch (err) {
        res.status(500).send(err);
    }
});

//update dailyRated
router.put('/api/rate', (req, res) => {
    db.User.updateOne({
        _id: req.signedCookies.user
    }, {
        $set: {
            dailyRated: req.body.dailyRated
        }
    }).then(user => res.end());
})

//get one network by name
router.get("/api/network/:name", (req, res) => {
    db.Network.findOne({
        name: req.params.name
    }).then((network) => {
        if (network) {
            res.send(network);
        } else {
            res.send("none");
        }
    })
});

//create new network
router.post("/api/network", (req, res) => {
    db.Network.create({
        name: req.body.name,
        rating: {
            accuracy: 0,
            neutrality: 0
        },
        amount: 0
    }).then(function (response) {
        res.send(response);
    }).catch(function (err) {
        console.log(err);
    })
})

//update network rating
router.put("/api/network", (req, res) => {
    db.Network.updateOne({
        name: req.body.name
    }, {
        $set: {
            rating: req.body.rating,
            amount: req.body.amount
        }
    }).then(function (network) {
        res.end();
    })
});

router.get("/api/all", (req, res) => {
    db.Network.find({}).then(data => {
        res.send(data);
    })
});

// get leaderboard rankings
router.get("/api/leaderboard", (req, res) => {
    db.Network.find({}).then(data => {
        let totalRatings = 0;
        let netArr = [];

        for (let network of data) {
            totalRatings += network.amount;
        }

        for (let network of data) {
            let n = network.amount;

            let a = network.rating[0].accuracy;
            let accuracyWeight = Math.pow(Math.pow((100 - a), 2) + Math.pow((totalRatings - n), 2), 0.5);

            let b = network.rating[0].neutrality;
            let neutralityWeight = Math.pow(Math.pow((100 - b), 2) + Math.pow((totalRatings - n), 2), 0.5);

            let overallWeight = (accuracyWeight + neutralityWeight) / 2;

            netArr.push({
                name: network.name,
                accuracyWeight: accuracyWeight,
                neutralityWeight: neutralityWeight,
                overallWeight: overallWeight
            })
        }
        res.send(netArr);
    })
})

//find all matching networks from search
router.post("/api/search", (req, res) => {
    let cleanText = req.body.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    cleanText = cleanText.trim();

    db.Network.find({
        name: RegExp('\\b' + cleanText, 'i')
    }).then((network) => {
        res.send(network);
    })
});


module.exports = router;