const axios = require("axios");
const keys = require("../apiKeys.js");

module.exports = function (app) {
    app.get("/api/articles", async function (req, res) {
        let articleLinks = [];
        let articleText = [];

        axios({
            url: `https://newsapi.org/v2/top-headlines?country=us&apiKey=${keys.news}`,
            method: "get"
        }).then(async (response) => {
            let articles = response.data.articles;
            for(let i = 0; i < Math.min(articles.length, 20); i++){
                articleLinks.push(articles[i].url);
            }

            try{
                for(let link of articleLinks){
                    let text = await axios({
                        "method":"GET",
                        "url":"https://aylien-text.p.rapidapi.com/extract",
                        "headers":{
                        "content-type":"application/octet-stream",
                        "x-rapidapi-host":"aylien-text.p.rapidapi.com",
                        "x-rapidapi-key": keys.scrape
                        },"params":{
                        "url": link
                        }
                        })
                        articleText.push(text.data.article);
                }
            }catch(err){
                console.log(err,"scraper");
            }

            res.send(articleText);
            
        }).catch((err) => {
            console.log(err,"newsapi");
        })
        
      });

};