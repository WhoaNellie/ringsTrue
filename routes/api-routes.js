const express = require("express");
const mongoose = require('mongoose');

const User = require("../models/Users");
const db = require("../models");
let keys = null;
 
if(!process.env.MONGODB_URI){
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

router.get("/api/articles", (req, res) => {
    db.Article.find({}).then((articles) => {
        res.send(articles);
    })
})

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
            res.status(200).send({dailyRated: user.dailyRated});
            console.log("success?");
        });

        
    }catch(err){
        res.status(500).send(err);
    }
})

// router.post("/api/rating", (req, res) => {
//     let rating = {
//         network: mongoose.Types.ObjectId(req.body.network),
//         rating: {
//             accuracy: req.body.accuracy,
//             neutrality: req.body.neutrality
//         }
//     }

//     db.Rating.create(rating).then(function (response) {
//         // console.log(response);
//         res.send(response);
//     }).catch(function (err) {
//         console.log(err);
//     })
// });

router.get("/api/network/:name", (req, res) => {
    db.Network.findOne({
        name: req.params.name
    }).then((network) => {
        if(network){
            res.send(network);
        }else{
            res.send("none");
        }
    })
});

router.post("/api/network", (req, res) => {
    db.Network.create({
        name: req.body.name,
        rating: {
            accuracy: 0,
            neutrality: 0
        },
        amount: 0
    }).then(function (response) {
        // console.log(response);
        res.send(response);
    }).catch(function (err) {
        console.log(err);
    })
})

router.put("/api/network", (req, res) => {
    console.log(req.body);

    db.Network.updateOne({name: req.body.name}, {
        $set: {
            rating: req.body.rating,
            amount: req.body.amount
        }
    }).then(function(network) {
        console.log(network);
        res.end();
    })
});

router.post("/api/search", (req, res) => {
    console.log(req.body.name);
    let cleanText = req.body.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    cleanText = cleanText.trim();

    db.Network.find(
            {
                name:  RegExp('\\b' + cleanText, 'i')
            }
    ).then((network) => {
        res.send(network);
    })
})

module.exports = router;