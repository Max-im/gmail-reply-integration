const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const logger = require("morgan");
const path = require("path");

const app = express();
const isProduction = process.env.NODE_ENV === "production";

app.use(bodyParser.urlencoded({ extended: false, limit: "250mb" }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(logger("dev"));

if (!isProduction) {
  const cors = require("cors");
  app.use(cors({ origin: "http://localhost:3000" }));
}

// db connect
const db = require("./config").db;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.info("db start"))
  .catch(err => console.error(err));

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/accounts", require("./routes/accounts"));
app.use("/input", require("./routes/input"));
app.use("/labels", require("./routes/labels"));
app.use("/integration", require("./routes/integration"));
app.use("/output", require("./routes/output"));

// Frontend build include
if (isProduction) {
  app.use(express.static(path.join(__dirname, "../client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "build", "index.html"));
  });
}

// Listen
const port = process.env.PORT || 5000;
app.listen(port, process.env.IP, () => console.info("server is runing"));
