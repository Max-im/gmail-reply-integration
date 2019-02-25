const { google } = require("googleapis");
const auth = require("../auth");

module.exports = account => {
  auth.setCredentials(account.token);
  const gmail = google.gmail({ version: "v1", auth });

  return new Promise(async (resolve, reject) => {
    gmail.users.labels.list({ userId: "me" }, (err, res) => {
      if (err) {
        console.error("Error getting account labels", err);
        return reject("Error getting account labels");
      }
      resolve(res.data.labels);
    });
  });
};
