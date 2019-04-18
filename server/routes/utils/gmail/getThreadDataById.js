const { google } = require("googleapis");
const auth = require("../auth");
const retrievePeopleFromThread = require("../common/retrievePeopleFromThread");
const Thread = require("../../../model/Threads");

module.exports = ({ id, userLabels, email }) => {
  const targetLabelsId = userLabels
    .filter(item => item.type === "user")
    .map(item => item.id);

  const gmail = google.gmail({ version: "v1", auth });
  const result = { id, labels: [], people: [], body: [], email };

  return new Promise((resolve, reject) => {
    const options = { id, userId: "me" };
    gmail.users.threads.get(options, (err, res) => {
      if (err) {
        if (
          err.errors &&
          err.errors[0] &&
          err.errors[0].message &&
          err.errors[0].message === "Not Found"
        ) {
          return Thread.findOneAndRemove({ id }).then(res => resolve());
        } else {
          console.log(err);
        }
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
