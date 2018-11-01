const Email = require("../../../model/Email");

function getDbEmails() {
  return new Promise(resolve => {
    Email.find().then(dbData => resolve(dbData));
  });
}

module.exports = getDbEmails;
