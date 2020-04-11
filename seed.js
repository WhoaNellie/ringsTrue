const mongoose = require("mongoose");
const db = require("./models");
const keys = require("./apiKeys");

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useFindAndModify: false
});

let articleSeed = [];

for(let i = 0; i < 20; i++){
    articleSeed.push({
        id: i,
        headline: `headline ${i}`,
        image: `image ${i}`,
        text: `text ${i}`,
        network: `network ${i}`
    })
}

db.Article.deleteMany({}).then(() => {
    db.Article.insertMany(articleSeed).then(data => {
        console.log(data.length + " records inserted!");
        process.exit(0);
      })
      .catch(err => {
        console.error(err);
        process.exit(1);
      });
})