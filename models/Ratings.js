const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
    network: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Network"
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

const Rating = mongoose.model("Rating", ratingSchema);


module.exports = Rating;