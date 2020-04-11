const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const keys = require("./apiKeys.js");

const PORT = process.env.PORT || 3000;
const app = express();

let uristring =
    process.env.MONGODB_URI ||
    process.env.MONGOLAB_URI ||
    keys.mongoURI;

app.use(logger("dev"));
app.use(compression());
app.use(express.json());
app.use(express.static("public"));

// routes
app.use(require("./routes/api-routes.js"));
app.use(require("./routes/html-routes.js"));

mongoose.connect(uristring, {
  useNewUrlParser: true,
  useFindAndModify: false
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});

// let User = require("./models/Users");

// let testUser = new User({
//     username: "testun",
//     password: "testpw",
//     dailyRated: 0
// });

// testUser.save(function(err) {
//     if (err) throw err;

//     // fetch user and test password verification
//     User.findOne({ username: 'testun' }, function(err, user) {
//         if (err) throw err;

//         // test a matching password
//         user.comparePassword('testpw', function(err, isMatch) {
//             if (err) throw err;
//             console.log('testpw:', isMatch); // -> Password123: true
//         });

//         // test a failing password
//         user.comparePassword('123Password', function(err, isMatch) {
//             if (err) throw err;
//             console.log('123Password:', isMatch); // -> 123Password: false
//         });
//     });
// });