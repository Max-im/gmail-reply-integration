const { google } = require("googleapis");
const auth = require("../auth/user");
const asyncLoop = require("node-async-loop");

module.exports = token => {
  auth.setCredentials(token);
  const drive = google.drive({ version: "v3", auth });
  const result = [];
  const arr = [];
  for (var i = 0; i < 1000; i++) {
    arr.push(i);
  }

  const options = {
    q: `(mimeType contains 'excel' or mimeType contains 'spreadsheet') and trashed=false`,
    pageSize: 500
  };

  return new Promise((resolve, reject) => {
    asyncLoop(arr, (page, nextPage) => {
      drive.files.list(options, (err, res) => {
        if (err) {
          console.error("Error getting File names", err);
          return reject("Error getting File names");
        }
        const { files, nextPageToken } = res.data;
        if (files) result.push(...files);

        if (nextPageToken) {
          options.pageToken = nextPageToken;
          nextPage();
        } else {
          resolve(result);
        }
      });
    });
  });
};
