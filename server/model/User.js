const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true },
  id: { type: String, required: true },
  name: { type: String, required: true },
  token: { type: Object, required: true },
  picture: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = User = mongoose.model("users", UserSchema);
