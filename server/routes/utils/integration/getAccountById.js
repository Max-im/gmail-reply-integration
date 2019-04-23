const jwt = require("jsonwebtoken");
const Accounts = require("../../../model/Accounts");
const { secretOrKey } = require("../../../config");

module.exports = _id => {
  return new Promise(async (resolve, reject) => {
    try {
      const theAccount = await Accounts.findOne({ _id });

      const decoded = {
        ...theAccount._doc,
        token: jwt.verify(theAccount.token, secretOrKey)
      };
      resolve(decoded);
    } catch (err) {
      reject(err);
    }
  });
};
