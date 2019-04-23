const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LabelSchema = new Schema({
  name: { type: String, required: true, unique: true, dropDups: true },
  checked: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

module.exports = Label = mongoose.model("labels", LabelSchema);
