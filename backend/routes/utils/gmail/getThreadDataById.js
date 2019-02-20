const { google } = require("googleapis");
const auth = require("../auth");
const retrievePeopleFromThread = require("../common/retrievePeopleFromThread");

module.exports = ({ id, userLabels, email }) => {
  const targetLabelsId = userLabels
    .filter(item => item.type === "user")
    .map(item => item.id);

  const gmail = google.gmail({ version: "v1", auth });

  const result = { threadId: id, labels: [], people: [], body: [], email };
  return new Promise((resolve, reject) => {
    const options = { id, userId: "me" };
    gmail.users.threads.get(options, (err, res) => {
      if (err) {
        return console.error("getting particular thread data error", err);
      }
      if (res.data.messages) {
        // retrieve people
        try {
          result.people = retrievePeopleFromThread(res.data.messages);
        } catch (err) {
          // save error
          console.log(err);
          console.log("Error retrieve people. " + id);
        }

        // retrieve labels
        result.labels = res.data.messages[0].labelIds
          .filter(item => targetLabelsId.includes(item))
          .map(labelId => userLabels.find(item => item.id === labelId).name);

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
