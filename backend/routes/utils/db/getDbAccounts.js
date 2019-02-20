const jwt = require("jsonwebtoken");
const Accounts = require("../../../model/Accounts");
const { secretOrKey } = require("../../../config");

module.exports = () => {
  return new Promise(async resolve => {
    const accounts = await Accounts.find();
    const decoded = accounts.map(item => ({
      ...item._doc,
      token: jwt.verify(item.token, secretOrKey)
    }));

    resolve(decoded);
  });
};
