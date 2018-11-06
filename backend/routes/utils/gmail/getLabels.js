const { google } = require("googleapis");
const asyncLoop = require("node-async-loop");
const Label = require("../../../model/Label");

function getLabels(authArr, auth) {
  const userId = "me";
  const labelsArr = [];

  return new Promise((resolve, reject) => {
    asyncLoop(
      authArr,
      (token, nextUser) => {
        auth.setCredentials(token);
        const gmail = google.gmail({ version: "v1", auth });
        gmail.users.labels.list({ userId }, (err, res) => {
          if (err) return reject({ msg: err });
          const labelsName = res.data.labels
            .filter(item => item.type === "user")
            .filter(item => item.name.match(/^!/))
            .map(item => item.name);

          labelsArr.push(...labelsName);
          nextUser();
        });
      },
      () => {
        Label.find().then(blackList => {
          const blackLabelsName = blackList.map(item => item.name);
          const uniqLabelArr = labelsArr
            .filter((v, i, a) => a.indexOf(v) === i)
            .filter(item => !blackLabelsName.includes(item));

          resolve({ labels: uniqLabelArr, blackList });
        });
      }
    );
  });
}

module.exports = getLabels;
