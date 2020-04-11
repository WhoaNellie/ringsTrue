const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const keys = require("./apiKeys");

const passport = require('passport');
const bodyParser = require('body-parser');
const expressSession = require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
});

const PORT = process.env.PORT || 3000;
const app = express();

app.use(logger("dev"));
app.use(compression());
app.use(express.json());
app.use(express.static("public"));

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);

//passport session
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use(require("./routes/api-routes.js"));
app.use(require("./routes/html-routes.js"));

var uristring =
    process.env.MONGODB_URI ||
    process.env.MONGOLAB_URI ||
    keys.mongoURI;

mongoose.connect(uristring, {
  useNewUrlParser: true,
  useFindAndModify: false
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});