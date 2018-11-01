const { google } = require("googleapis");
const emailValidation = require("../../../validate/emailValidation");

const getSheetData = async (auth, spreadsheetId, range) => {
  const sheets = google.sheets({ version: "v4", auth });

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get({ spreadsheetId, range }, (err, res) => {
      if (err) {
        return reject(err);
      }
      const { values } = res.data;

      // verify value exist
      if (values === undefined) {
        return reject({ error: { message: "Data undefined", code: 404 } });
      }

      // verify Email column exists
      const index = values[0].indexOf("Email");
      const tabLen = values[0].length;
      if (index === -1) {
        return reject({
          error: {
            message: "Email field is required column in Header",
            code: 404
          }
        });
      }

      const emailArr = values.map(item => item[index].toLowerCase());
      emailArr.shift();
      while (emailArr[emailArr.length - 1] === "") emailArr.pop();
      if (emailArr.length === 0) {
        return reject({
          error: {
            message: "Email field is empty",
            code: 404
          }
        });
      }
      const { isValid, errors } = emailValidation(emailArr);
      if (!isValid) return reject(errors);
      resolve({ emailArr, tabLen });
    });
  });
};

module.exports = getSheetData;
