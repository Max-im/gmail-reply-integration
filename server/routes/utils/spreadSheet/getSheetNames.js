const { google } = require("googleapis");
const auth = require("../auth/user");

const getFileInitData = (token, spreadsheetId) => {
  auth.setCredentials(token);
  const sheets = google.sheets({ version: "v4", auth });

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.get({ spreadsheetId }, (err, res) => {
      if (err) {
        console.error("Error getting sheet names", err);
        return reject("Error getting sheet names");
      }
      const { sheets } = res.data;
      const result = sheets
        .map(item => item.properties)
        .map(item => ({ title: item.title, sheetId: item.sheetId }));
      resolve(result);
    });
  });
};

module.exports = getFileInitData;
