const { google } = require("googleapis");
const auth = require("../auth");
const retrievePeopleFromThread = require("../common/retrievePeopleFromThread");

module.exports = ({ id, account }) => {
  const { email, token } = account;
  auth.setCredentials(token);
  const gmail = google.gmail({ version: "v1", auth });
  const result = { id, labels: [], people: [], body: [], email, historyId: 0 };

  return new Promise((resolve, reject) => {
    const options = { id, userId: "me" };
    gmail.users.threads.get(options, (err, res) => {
      if (err) {
        console.log(err);
        console.log("Error get data from thread", id, account.email);
        resolve(result);
      }

      if (res && res.data.messages) {
        // retrieve people
        try {
          result.people = retrievePeopleFromThread(res.data.messages);
        } catch (err) {
          console.error("Error getting threads by ID", err);
          reject("Error getting threads by ID");
        }

        // retrieve labels
        result.labels = res.data.messages[0].labelIds;

        // retrieve body with date
        // TODO retrieve the whole body
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
