const { google } = require("googleapis");
const asyncLoop = require("node-async-loop");
const auth = require("../auth");

module.exports = (account, targetLabelsId) => {
  auth.setCredentials(account.token);
  const gmail = google.gmail({ version: "v1", auth });
  const result = [];
  const arr = [];
  for (var i = 0; i < 100; i++) {
    arr.push(i);
  }

  return new Promise(async (resolve, reject) => {
    asyncLoop(
      targetLabelsId,
      (labelId, nextLabel) => {
        const options = { userId: "me", maxResults: 500, labelIds: [labelId] };
        asyncLoop(arr, (page, nextPage) => {
          gmail.users.threads.list(options, (err, res) => {
            if (err) return reject(err);

            if (!res.data.threads) return nextLabel();

            result.push(...res.data.threads);
            if (res.data.nextPageToken) {
              options.pageToken = res.data.nextPageToken;
              nextPage();
            } else {
              return nextLabel();
            }
          });
        });
      },
      () => {
        const arr = [];
        const uniqArr = result.filter(item => {
          if (arr.includes(item.id)) return false;
          arr.push(item.id);
          return true;
        });
        resolve(uniqArr);
      }
    );
  });
};
