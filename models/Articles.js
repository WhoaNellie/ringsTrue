const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schema = new Schema({
    id:{
        type: Number
    },
    headline: {
        type: String
    },
    image: {
        type: String
    },
    description:{
        type: String
    },
    text: {
        type: String
    },
    network: {
        type: String
    }
});

const Article = mongoose.model("Article", schema);

module.exports = Article;