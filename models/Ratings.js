const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
    network: {
        type: String
    },
    rating: [{
        information: {
            type: Number
        },
        neutrality: {
            type: Number
        }
    }]
});

const Rating = mongoose.model("Rating", ratingSchema);


module.exports = Rating;