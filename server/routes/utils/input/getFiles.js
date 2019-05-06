const { google } = require("googleapis");
const auth = require("../auth")("user");
const asyncLoop = require("node-async-loop");

module.exports = async token => {
  auth.setCredentials(token);
  const drive = google.drive({ version: "v3", auth });
  const result = [];
  const arr = [];
  for (var i = 0; i < 1000; i++) {
    arr.push(i);
  }
  let isDone = false;

  const options = {
    q: `(mimeType contains 'excel' or mimeType contains 'spreadsheet') and trashed=false`,
    pageSize: 500
  };

  return new Promise((resolve, reject) => {
    asyncLoop(
      arr,
      (page, nextPage) => {
        if (isDone) return nextPage();

        drive.files.list(options, (err, res) => {
          if (err) return reject(err);

          const { files, nextPageToken } = res.data;
          if (files) result.push(...files);
          if (nextPageToken) options.pageToken = nextPageToken;
          else isDone = true;
          nextPage();
        });
      },
      () => resolve(result)
    );
  });
};
