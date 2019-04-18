const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const isProduction = process.env.NODE_ENV === "production";

app.use(bodyParser.urlencoded({ extended: false, limit: "250mb" }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));
const port = process.env.PORT || 5000;
if (!isProduction) {
  const cors = require("cors");
  const logger = require("morgan");
  app.use(cors({ origin: "http://localhost:3000" }));
  app.use(logger("dev"));
}

// db connect
const db = require("./config").db;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.info("db start"))
  .catch(err => console.error(err));

// Routing export
const auth = require("./routes/auth");
const settings = require("./routes/settings");
const integration = require("./routes/integration");

// includes routes
app.use("/auth", auth);
app.use("/settings", settings);
app.use("/integration", integration);

// Frontend build include
if (isProduction) {
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}

// Listen
app.listen(port, process.env.IP, () => console.info("server is runing"));
