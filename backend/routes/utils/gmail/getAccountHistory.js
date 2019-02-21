const { google } = require("googleapis");
const auth = require("../auth");
const asyncLoop = require("node-async-loop");

module.exports = account => {
  auth.setCredentials(account.token);
  const gmail = google.gmail({ version: "v1", auth });
  const arr = [];
  for (var i = 0; i < 1000; i++) {
    arr.push(i);
  }
  const result = [];
  let theHistoryId = false;

  return new Promise((resolve, reject) => {
    const options = { userId: "me", startHistoryId: account.historyId };
    gmail.users.history.list(options, (err, res) => {
      if (err) return console.error(err);
      asyncLoop(arr, (page, nextPage) => {
        const { history, historyId } = res.data;
        // store first got history id
        if (!theHistoryId) theHistoryId = historyId;

        // save threads id
        if (history) {
          history.forEach(item => {
            if (!result.includes(item.messages[0].threadId)) {
              result.push(item.messages[0].threadId);
            }
          });
        }

        // if exists next page go on it
        if (res.data.nextPageToken) {
          options.pageToken = res.data.nextPageToken;
          nextPage();
        } else {
          resolve({ result, historyId: theHistoryId });
        }
      });
    });
  });
};
