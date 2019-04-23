const { google } = require("googleapis");
const retrievePeopleFromThread = require("./retrievePeopleFromThread");
const auth = require("../auth")("account");

module.exports = ({ id, account }) => {
  const { email, token } = account;
  auth.setCredentials(token);
  const gmail = google.gmail({ version: "v1", auth });
  const result = { id, labels: [], people: [], body: [], email, historyId: 0 };

  return new Promise((resolve, reject) => {
    const options = { id, userId: "me" };
    gmail.users.threads.get(options, (err, res) => {
      if (err) {
        console.log("Error get data from thread", id, account.email);
        reject(err);
      }

      if (res && res.data.messages) {
        // retrieve people
        try {
          result.people = retrievePeopleFromThread(res.data.messages);
        } catch (err) {
          reject(err);
        }

        // retrieve labels
        result.labels = res.data.messages[0].labelIds;

        // retrieve body with date
        result.body.push(
          ...res.data.messages
            .map(item => item.snippet)
            .filter(item => item.trim().length > 0)
        );

        // historyId
        result.historyId = res.data.historyId;
      }
      resolve(result);
    });
  });
};
