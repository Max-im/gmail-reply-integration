const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ThreadsMapSchema = new Schema({
  id: { type: String, required: true, unique: true, dropDups: true },
  email: { type: String, required: true },
  labels: { type: Array, required: true },
  people: { type: Array, required: true },
  body: { type: Array, required: true },
  historyId: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = ThreadMap = mongoose.model("threads-map", ThreadsMapSchema);
