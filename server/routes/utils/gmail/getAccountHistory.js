const { google } = require("googleapis");
const auth = require("../auth");

module.exports = (account, options) => {
  auth.setCredentials(account.token);
  const gmail = google.gmail({ version: "v1", auth });

  return new Promise((resolve, reject) => {
    gmail.users.history.list(options, (err, res) => {
      if (err) {
        console.error("Error getting account history", err);
        return reject("Error getting account history");
      }
      resolve(res.data);
    });
  });
};
