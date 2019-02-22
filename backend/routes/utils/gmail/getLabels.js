const { google } = require("googleapis");
const asyncLoop = require("node-async-loop");
const auth = require("../auth");

module.exports = accounts => {
  const userId = "me";
  const labelsArr = [];

  return new Promise((resolve, reject) => {
    asyncLoop(
      accounts,
      (account, nextUser) => {
        auth.setCredentials(account.token);
        const gmail = google.gmail({ version: "v1", auth });

        gmail.users.labels.list({ userId }, (err, res) => {
          if (err) return reject(err);

          const labelsName = res.data.labels
            .filter(item => item.type === "user")
            .filter(item => item.name.match(/^!/))
            .map(item => item.name);

          labelsArr.push(...labelsName);
          nextUser();
        });
      },
      async () => {
        // filter unique labels
        const labels = labelsArr.filter((v, i, a) => a.indexOf(v) === i);

        resolve(labels);
      }
    );
  });
};
