const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schema = new Schema({
    network: {
        type: String
    },
    user: {
        type: String
    },
    ratings: [{
        accuracy: {
            type: Number
        },
        nutrality: {
            type: Number
        }
    }]
});

const Rating = mongoose.model("Rating", schema);

module.exports = Rating;