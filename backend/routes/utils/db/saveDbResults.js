const Email = require("../../../model/Email");
const asyncLoop = require("node-async-loop");

function saveDbResults(resultArr) {
  return new Promise(resolve => {
    asyncLoop(
      resultArr,
      (result, nextResult) => {
        const { email, labels, body } = result;
        Email.findOne({ email }).then(emailOne => {
          if (emailOne) {
            Email.findOneAndDelete({ email }).then(emailOne => {
              const newEmail = new Email({ email, labels, body });
              newEmail.save().then(res => nextResult());
            });
          } else {
            const newEmail = new Email({ email, labels, body });
            newEmail.save().then(res => nextResult());
          }
        });
      },
      () => resolve()
    );
  });
}

module.exports = saveDbResults;
