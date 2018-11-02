const Email = require("../../../model/Email");

function saveDbResults(result) {
  return new Promise(resolve => {
    const { email, labels, body } = result;
    Email.findOne({ email }).then(emailOne => {
      if (emailOne) {
        Email.findOneAndDelete({ email }).then(emailOne => {
          const newEmail = new Email({ email, labels, body });
          newEmail.save().then(res => resolve());
        });
      } else {
        const newEmail = new Email({ email, labels, body });
        newEmail.save().then(res => resolve());
      }
    });
  });
}

module.exports = saveDbResults;
