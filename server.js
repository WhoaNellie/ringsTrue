const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo")(session);
require("dotenv").config();

const PORT = process.env.PORT;
const app = express();

let uristring = process.env.MONGODB_URI;

let cookie_key = process.env.cookie_key;

mongoose
  .connect(uristring, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB has been connected"))
  .catch((err) => console.log(err));

const db = mongoose.connection;

//cookies
app.use(
  session({
    secret: cookie_key,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db,
    }),
    cookie: {
      maxAge: null,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use(logger("dev"));
app.use(compression());
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser(cookie_key));

// routes
app.use(require("./routes/api-routes.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
