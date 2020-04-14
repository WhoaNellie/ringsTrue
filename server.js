const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const keys = null;
 
if(!process.env.PORT){
  keys = require("./apiKeys.js");
}
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
