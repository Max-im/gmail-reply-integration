const { google } = require("googleapis");
const asyncLoop = require("node-async-loop");

const saveMailId = require("./saveMailId");
const saveBodyAndLabels = require("./saveBodyAndLabels");
const saveDbResults = require("../db/saveDbResults");

const getEmailLabelAndBody = (authArr, email, auth) => {
  const result = { email, labels: [], body: [] };

  return new Promise((resolve, reject) => {
    // DONT CHECK THE EMAILS

    if (email.match(/idealscorp\.com$/i)) {
      return resolve(result);
    }

    // LOOP ACCOUNTS
    asyncLoop(
      authArr,
      async (token, nextUser) => {
        auth.setCredentials(token);
        const idArr = await saveMailId(auth, email);

        // LOOP EMAILS ID
        asyncLoop(
          idArr,
          async (msgId, nextId) => {
            if (msgId) {
              const { labels, body } = await saveBodyAndLabels(auth, msgId);

              if (body.length > 0) {
                result.body.push(body);
              }
              if (labels.length > 0) {
                // LOOP LABELS
                asyncLoop(
                  labels,
                  (labelId, nextLabel) => {
                    const gmail = google.gmail({ version: "v1", auth });
                    gmail.users.labels.get(
                      { userId: "me", id: labelId },
                      (err, res) => {
                        if (err) return reject({ msg: err });
                        result.labels.push(res.data.name);
                        nextLabel();
                      }
                    );
                  },
                  // LOOP LABELS callback
                  () => nextId()
                ); // LOOP LABELS finish
              } else nextId();
            } else nextId();
          },
          // LOOP EMAILS ID callback
          () => nextUser()
        ); // LOOP EMAILS ID finish
      },

      // LOOP ACCOUNTS Callback
      async () => {
        // save each email in db
        await saveDbResults(result);

        resolve(result);
      }
    ); // LOOP ACCOUNTS finish
  }).catch(err => console.log(err));
};

module.exports = getEmailLabelAndBody;
