const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmailSchema = new Schema({
  email: { type: String, required: true },
  labels: { type: Array, required: true },
  body: { type: Array, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = Email = mongoose.model("emails", EmailSchema);
