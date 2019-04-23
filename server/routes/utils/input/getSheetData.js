const { google } = require("googleapis");
const auth = require("../auth")("user");

module.exports = (token, spreadsheetId, range) => {
  auth.setCredentials(token);
  const sheets = google.sheets({ version: "v4", auth });

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get({ spreadsheetId, range }, (err, res) => {
      if (err) return reject(err);

      // check data not empty
      const { values } = res.data;
      if (!values) return reject("The sheet is empty");

      // check Email header
      const head = values[0];
      const index = head.indexOf("Email");
      if (index === -1) return reject("Email header is required");
      const emailArr = values.map(item => item[index]);
      emailArr.shift();

      // cut empty tail
      while (
        emailArr.length !== 0 &&
        (emailArr[emailArr.length - 1] === undefined ||
          emailArr[emailArr.length - 1].length === 0)
      ) {
        emailArr.pop();
      }

      // check email column not empty
      if (emailArr.length === 0) return reject("Email column is empty");

      const lower = emailArr.map(item => item.toLowerCase());

      resolve(lower);
    });
  });
};
