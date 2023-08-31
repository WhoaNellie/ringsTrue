const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();
const db = require("./models");

let keys = null;

let uristring =
  process.env.MONGODB_URI || process.env.MONGOLAB_URI || keys.mongoURI;
let newsKey = process.env.news_key || keys.news;
let scrapeKey = process.env.scrape_key || keys.scrape;

mongoose.connect(uristring, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

async function getArticles() {
  let articleLinks = [];
  let articleData = [];

  axios({
    url: `https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsKey}`,
    method: "get",
  })
    .then(async (response) => {
      let articles = response.data.articles;

      for (let i = 0; i < Math.min(articles.length, 20); i++) {
        if (typeof articles[i].url === "string") {
          articleLinks.push(articles[i].url);
        }
      }

      for (let i = 0; i < articleLinks.length; i++) {
        let text;
        try {
          const options = {
            method: "GET",
            url: "https://text-extract7.p.rapidapi.com/",
            params: {
              url: articleLinks[i],
            },
            headers: {
              "X-RapidAPI-Key": process.env.scrape_key,
              "X-RapidAPI-Host": "text-extract7.p.rapidapi.com",
            },
          };

          try {
            const response = await axios.request(options);
            text = response.data;
            console.log(text.text);
          } catch (error) {
            console.error(error);
          }

          if (text?.text) {
            let cleanHead = articles[i].title.replace(/\-[^-]*$/g, "");

            let brandVariations = [
              articles[i].source.name,
              articles[i].source.name.replace(/\s/g, ""),
              articles[i].source.name.replace(/\.[^.]*$/gi, ""),
            ];

            let filter = new RegExp(
              `\\b(${brandVariations.join("|")})\\b`,
              "gi"
            );

            let cleanText = text.text.replace(filter, "🟣🟣🟣🟣🟣");

            articleData.push({
              id: i,
              headline: cleanHead.trim(),
              image: articles[i].urlToImage,
              description: articles[i].description,
              text: cleanText,
              network: articles[i].source.name.replace(/\.[^.]*$/gi, ""),
            });
          }
        } catch (err) {
          console.log(err, "scraper");
        }
      }

      sendArticles(articleData);
    })
    .catch((err) => {
      console.log(err, "newsapi");
    });
}

function sendArticles(req) {
  console.log(req);
  if (req.length >= 5) {
    db.Article.deleteMany({})
      .then(() => {
        db.Article.insertMany(req)
          .then((data) => {
            db.User.updateMany(
              {},
              {
                $set: {
                  dailyRated: [],
                },
              }
            ).then((res) => {
              console.log(data.length + " records inserted and users reset!");
              process.exit(0);
            });
          })
          .catch((err) => {
            console.error(err);
            process.exit(1);
          });
      })
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  }
}

getArticles();
