const axios = require("axios");
const keys = require("../apiKeys.js");

module.exports = function (app) {
    app.get("/api/articles", function (req, res) {
        let articleLinks = [];

        axios({
            url: `https://newsapi.org/v2/top-headlines?country=us&apiKey=${keys.news}`,
            method: "get"
        }).then((response) => {
            let articles = response.data.articles;
            for(let i = 0; i < Math.min(articles.length, 20); i++){
                articleLinks.push(articles[i].url);
            }
            res.send(articleLinks);
        }).catch((err) => {
            console.log(err);
        })
        
      });

};