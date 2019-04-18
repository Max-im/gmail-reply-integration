const { google } = require("googleapis");
const auth = require("../auth");

module.exports = ({ account, isNewAccount, options }) => {
  if (isNewAccount) auth.setCredentials(account.token);

  const gmail = google.gmail({ version: "v1", auth });

  return new Promise(async (resolve, reject) => {
    gmail.users.threads.list(options, (err, res) => {
      if (err) {
        console.error(err, account.email, "Error getting account threads");
        return reject(`Error getting ${account.email} threads`);
      }
      resolve(res.data);
    });
  });
};
