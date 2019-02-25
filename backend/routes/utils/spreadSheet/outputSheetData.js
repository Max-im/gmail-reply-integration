const { google } = require("googleapis");
const auth = require("../auth/user");
const columnMap = require("./columnMap");

module.exports = (token, spreadsheetId, range, data) => {
  auth.setCredentials(token);
  const sheets = google.sheets({ version: "v4", auth });

  return new Promise((resolve, reject) => {
    // get last full column
    sheets.spreadsheets.values.get({ spreadsheetId, range }, (err, res) => {
      if (err) return reject(err);
      const { values } = res.data;
      if (!values) return reject("cant reach the file");
      let maxLen = 0;
      values.forEach(item => {
        if (item.length + 1 > maxLen) maxLen = item.length + 1;
      });
      const column = columnMap(maxLen);

      // past data
      sheets.spreadsheets.values.append(
        {
          spreadsheetId,
          range: `${range}!${column}1:${column}${values.length}`,
          valueInputOption: "RAW",
          resource: {
            values: data.map(item => [item])
          }
        },
        (err, res) => {
          if (err) return reject(err);

          resolve();
        }
      );
    });
  });
};
