const { google } = require("googleapis");

const getFileInitData = (auth, spreadsheetId) => {
  const sheets = google.sheets({ version: "v4", auth });
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.get({ spreadsheetId }, (err, res) => {
      if (err) return reject("File not found, check the permissions");
      const sheetNames = res.data.sheets.map(item => item.properties.title);
      resolve(sheetNames);
    });
  });
};

module.exports = getFileInitData;
