const mongoose = require("mongoose");
const axios = require("axios");

const db = require("./models");

let keys = null;

if (!process.env.MONGODB_URI) {
    keys = require("./apiKeys.js");
}

let uristring =
    process.env.MONGODB_URI ||
    process.env.MONGOLAB_URI ||
    keys.mongoURI;
let newsKey = process.env.news_key || keys.news;
let scrapeKey = process.env.scrape_key || keys.scrape;


mongoose.connect(uristring, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

async function getArticles() {
    let articleLinks = [];
    let articleData = [];

    axios({
        url: `https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsKey}`,
        method: "get"
    }).then(async (response) => {
        let articles = response.data.articles;
        // console.log(articles.length);
        for (let i = 0; i < Math.min(articles.length, 20); i++) {
            if (typeof (articles[i].url) === "string") {
                articleLinks.push(articles[i].url);
            }
        }

        console.log(articleLinks.length);

        for (let i = 0; i < articleLinks.length; i++) {
            try {

                let text = await axios({
                    "method": "GET",
                    "url": "https://aylien-text.p.rapidapi.com/extract",
                    "headers": {
                        "content-type": "application/octet-stream",
                        "x-rapidapi-host": "aylien-text.p.rapidapi.com",
                        "x-rapidapi-key": scrapeKey
                    },
                    "params": {
                        "url": articleLinks[i]
                    }
                });
                // console.log(text);
                if (text.data.article) {
                    //let cleantext = text.data.article.replace(/\n/g, "<br />");
                    let cleanHead = articles[i].title.replace(/\-[^-]*$/g, "");

                    let brandVariations = [articles[i].source.name, articles[i].source.name.replace(/\s/g, '')];

                    let filter = new RegExp(`\\b(${brandVariations.join('|')})\\b`, 'gi');

                    let cleanText = text.data.article.replace(filter,"&#9608;&#9608;&#9608;&#9608;");

                    articleData.push({
                        id: i,
                        headline: cleanHead,
                        image: articles[i].urlToImage,
                        description: articles[i].description,
                        text: cleanText,
                        network: articles[i].source.name
                    });
                }

            } catch (err) {
                console.log(err, "scraper");
            }
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