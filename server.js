const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo")(session);

// let keys = null;

// if (!process.env.DB_URI) {
//   keys = require("./apiKeys.js");
// }
const PORT = process.env.PORT || 3000;
const app = express();

let uristring =
  process.env.DB_URI;

// let cookie_key = process.env.cookie_key;

// mongoose.connect(uristring, {
//   useNewUrlParser: true,
//   useFindAndModify: false,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;

//cookies
// app.use(
//   session({
//     secret: cookie_key,
//     resave: true,
//     saveUninitialized: false,
//     store: new MongoStore({
//       mongooseConnection: db,
//     }),
//     cookie: {
//       maxAge: null,
//       httpOnly: false,
//       secure: process.env.NODE_ENV === "production",
//     },
//   })
// );

app.use(logger("dev"));
app.use(compression());
app.use(express.json());
app.use(express.static("public"));
// app.use(cookieParser(cookie_key));

// routes
app.use(require("./routes/api-routes.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
