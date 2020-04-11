const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schema = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    dailyRated: {
        type: Number
    }
});

const User = mongoose.model("User", schema);

module.exports = User;