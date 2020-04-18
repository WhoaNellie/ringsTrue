const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String
    },
    rating: [{
        accuracy: {
            type: Number
        },
        neutrality: {
            type: Number
        }
    }],
    amount: {
        type: Number
    }
});

const Network = mongoose.model("Network", schema);

module.exports = Network;