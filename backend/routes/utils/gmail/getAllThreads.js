const { google } = require("googleapis");
const auth = require("../auth");

module.exports = (account, options) => {
  auth.setCredentials(account.token);
  const gmail = google.gmail({ version: "v1", auth });

  return new Promise(async (resolve, reject) => {
    gmail.users.threads.list(options, (err, res) => {
      if (err) return reject(err);
      resolve(res.data);
    });
  });
};
