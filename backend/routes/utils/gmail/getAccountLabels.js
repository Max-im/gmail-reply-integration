const { google } = require("googleapis");
const auth = require("../auth");

module.exports = account => {
  auth.setCredentials(account.token);
  const gmail = google.gmail({ version: "v1", auth });

  return new Promise(async resolve => {
    gmail.users.labels.list({ userId: "me" }, (err, res) => {
      if (err) {
        console.error("getting Account target labels error", err.response.data);
      }
      resolve(res.data.labels);
    });
  });
};
