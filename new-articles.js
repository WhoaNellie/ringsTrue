const mongoose = require("mongoose");
const axios = require("axios");
const db = require("./models");
const keys = require("./apiKeys.js");
let uristring =
    process.env.MONGODB_URI ||
    process.env.MONGOLAB_URI ||
    keys.mongoURI;

mongoose.connect(uristring, {
    useNewUrlParser: true,
    useFindAndModify: false
  });

async function getArticles() {
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

        sendArticles(articleData);

    }).catch((err) => {
        console.log(err, "newsapi");
    })
}

function sendArticles(req) {
    db.Article.deleteMany({}).then(() => {
        db.Article.insertMany(req).then(data => {
                console.log(data.length + " records inserted!");
                process.exit(0);
            })
            .catch(err => {
                console.error(err);
                process.exit(1);
            });
    }).catch(err => {
        console.error(err);
        process.exit(1);
    });
}

getArticles();