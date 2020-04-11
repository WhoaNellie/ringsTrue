const express = require("express");
const axios = require("axios");
const db = require("../models");
const keys = require("../apiKeys.js");

const router = express.Router();

router.get("/api/articles", async function (req, res) {
    let articleLinks = [];
    let articleData = [];

    axios({
        url: `https://newsapi.org/v2/top-headlines?country=us&apiKey=${keys.news}`,
        method: "get"
    }).then(async (response) => {
        let articles = response.data.articles;
        for (let i = 0; i < Math.min(articles.length, 20); i++) {
            articleLinks.push(articles[i].url);
        }

        try {
            for (let i = 0; i < articleLinks.length; i++) {
                let text = await axios({
                    "method": "GET",
                    "url": "https://aylien-text.p.rapidapi.com/extract",
                    "headers": {
                        "content-type": "application/octet-stream",
                        "x-rapidapi-host": "aylien-text.p.rapidapi.com",
                        "x-rapidapi-key": keys.scrape
                    },
                    "params": {
                        "url": articleLinks[i]
                    }
                })
                articleData.push({
                    id: i,
                    headline: articles[i].title,
                    image: articles[i].urlToImage,
                    text: text.data.article,
                    network: articles[i].source.name
                })
            }
        } catch (err) {
            console.log(err, "scraper");
        }

        res.send(articleData);

    }).catch((err) => {
        console.log(err, "newsapi");
    })

});

router.put("/api/articles", function (req, res) {
    for (let i = 0; i < Math.min(req.body.length, 20); i++) {
        db.Article.updateOne({
            "id": req.body[i].id
        }, {
            $set: req.body[i]
        })
    }
})

module.exports = router;