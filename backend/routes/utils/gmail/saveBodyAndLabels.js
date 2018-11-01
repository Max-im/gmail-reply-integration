const { google } = require("googleapis");
const parseBodyAndLabels = require("./parseBodyAndLabels");

function saveBodyAndLabels(auth, id) {
  const gmail = google.gmail({ version: "v1", auth });
  const userId = "me";
  const format = "full";
  const metadataHeaders = ["Subject", "To", "From", "Date"];

  return new Promise((resolve, reject) => {
    gmail.users.messages.get(
      { id, userId, format, metadataHeaders },
      (err, res) => {
        if (err) return reject({ msg: err });
        const { body, labels } = parseBodyAndLabels(res.data);
        resolve({ body, labels });
      }
    );
  });
}

module.exports = saveBodyAndLabels;
