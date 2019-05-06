const { google } = require("googleapis");
const asyncLoop = require("node-async-loop");
const auth = require("../auth")("account");

const exclude = [
  "!SENT",
  "!pierre.martinow@idealsmail.com",
  "!Developable",
  "!Not developable",
  "!Process_Tags"
];

module.exports = accounts => {
  const labelsArr = [];

  return new Promise((resolve, reject) => {
    asyncLoop(
      accounts,
      (account, nextUser) => {
        auth.setCredentials(account.token);
        const gmail = google.gmail({ version: "v1", auth });

        gmail.users.labels.list({ userId: "me" }, (err, res) => {
          if (err) return reject(err);

          const labelsName = res.data.labels
            .filter(item => item.type === "user")
            .filter(item => item.name.match(/^!/))
            .filter(item => !item.name.match(/^!Campaign/g))
            .filter(label => !exclude.includes(label.name))
            .map(label => ({
              id: label.id,
              email: account.email,
              name: label.name
            }));

          labelsArr.push(...labelsName);
          nextUser();
        });
      },
      () => {
        // filter unique labels
        const labels = labelsArr.filter((v, i, a) => a.indexOf(v) === i);

        resolve(labels);
      }
    );
  });
};
