const jwt = require("jsonwebtoken");
const Accounts = require("../../../model/Accounts");

const { secretOrKey } = require("../../../config/key");

function getDbAccounts() {
  return new Promise((resolve, reject) => {
    Accounts.find().then(dbAcc => {
      const decodeAcc = dbAcc.map(item => {
        const decodedToken = jwt.verify(item.token, secretOrKey);
        return { ...decodedToken };
      });

      if (decodeAcc.length === 0) reject("Accounts not found");

      resolve(decodeAcc);
    });
  });
}

module.exports = getDbAccounts;
