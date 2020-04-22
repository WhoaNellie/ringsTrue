const express = require("express");
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');


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

//check if login cookie is valid
router.post("/api/cookie", (req, res) => {
    console.log('Cookies: ', req.signedCookies)

    db.User.findById(req.signedCookies.user).then((user) => {
        console.log(user);
        if(user){
            res.send({dailyRated: user.dailyRated});
        }
        else{
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

//register new user and send cookie
router.post("/api/register", async (req, res) => {
        try{
            let oldUser = await db.User.find({username: req.body.username});

            if(oldUser.length === 0){
                try{
                    let newUser = new User(req.body);
                    let result = await newUser.save();
                    console.log(result);
                    res.cookie('user', result._id, { signed: true });
                    res.send(result);
                        
                }catch (err){
                    res.status(500).send(err);
                } 
            }else{
                res.status(401).send({ message: "That Username Has Already Been Taken" });
                return;
            }
        }catch(err){
            res.status(500).send(err);
        } 
        
});

//login and send cookie
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
            res.cookie('user', user._id, { signed: true });
            res.status(200).send({dailyRated: user.dailyRated});
        });

        
    }catch(err){
        res.status(500).send(err);
    }
});

//update dailyRated
router.put('/api/rate', (req, res) => {
    console.log(req.body);
    console.log(req.signedCookies.user)
    db.User.updateOne({_id: req.signedCookies.user}, {
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
        if(network){
            res.send(network);
        }else{
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
        // console.log(response);
        res.send(response);
    }).catch(function (err) {
        console.log(err);
    })
})

//update network rating
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

router.get("/api/all", (req, res) => {
    db.Network.find({}).then(data => {
        res.send(data);
    }
    )
})

//find all matching networks from search
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
});


module.exports = router;