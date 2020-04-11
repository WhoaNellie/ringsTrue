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
        accuracy: {
            type: Number
        },
        nutrality: {
            type: Number
        }
    }]
});

const Network = mongoose.model("Network", schema);

module.exports = Network;