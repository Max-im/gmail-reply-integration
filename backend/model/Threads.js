const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ThreadsSchema = new Schema({
  threadId: { type: String, required: true },
  email: { type: String, required: true },
  labels: { type: Array, required: true },
  people: { type: Array, required: true },
  body: { type: Array, required: true },
  historyId: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = Thread = mongoose.model("threads", ThreadsSchema);
