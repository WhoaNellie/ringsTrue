const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String
    },
    logo: {
        type: String
    },
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating"
    }]
});

const Network = mongoose.model("Network", schema);

module.exports = Network;