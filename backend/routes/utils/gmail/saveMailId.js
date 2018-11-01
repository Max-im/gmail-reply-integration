const { google } = require("googleapis");

function saveMailId(auth, email) {
  const gmail = google.gmail({ version: "v1", auth });
  const userId = "me";
  const q = `from:${email} OR to:${email} AND -cc:${email} AND -bcc:${email}`;
  const idArr = [];

  return new Promise((resolve, reject) => {
    gmail.users.messages.list({ userId, q }, (err, res) => {
      if (err) return reject({ msg: err });
      if (res.data.resultSizeEstimate > 0) {
        idArr.push(...res.data.messages.map(item => item.id));
      }
      resolve(idArr);
    });
  });
}

module.exports = saveMailId;
