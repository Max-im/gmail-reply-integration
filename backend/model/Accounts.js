const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountsSchema = new Schema({
  gId: { type: String, required: true },
  name: { type: String, required: true },
  img: { type: String, required: true },
  token: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = Accounts = mongoose.model("accounts", AccountsSchema);
