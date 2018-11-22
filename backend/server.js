const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const timeout = require("connect-timeout");
const path = require("path");

const app = express();
const isProduction = process.env.NODE_ENV === "production";

app.use(timeout(1200000));
app.use(haltOnTimedout);

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

app.use(bodyParser.urlencoded({ extended: false, limit: "250mb" }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));
const port = process.env.PORT || 5000;
if (!isProduction) {
  const cors = require("cors");
  app.use(cors({ origin: "http://localhost:3000" }));
} else {
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
}

// db connect
const MONGO_DB = require("./config/key").MONGO_DB;
mongoose
  .connect(
    MONGO_DB,
    { useNewUrlParser: true }
  )
  .then(() => console.log("db start"));

// Routing export
const auth = require("./routes/auth");
const settings = require("./routes/settings");
const integration = require("./routes/integration");

// Passport middleware
app.use(passport.initialize());
require("./config/passport")(passport);

// includes routes
app.use("/auth", auth);
app.use("/settings", settings);
app.use("/integration", integration);

// Frontend build include
if (isProduction) {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}

// Listen
app.listen(port, process.env.IP, () => console.log("server is runing"));
