const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountsSchema = new Schema({
  gId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, require: true },
  img: { type: String, required: true },
  token: { type: String, required: true },
  historyId: { type: Number, default: 0 },
  isUploaded: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

module.exports = Accounts = mongoose.model("accounts", AccountsSchema);
