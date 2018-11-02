const { google } = require("googleapis");
const asyncLoop = require("node-async-loop");

const saveMailId = require("./saveMailId");
const saveBodyAndLabels = require("./saveBodyAndLabels");
const saveDbResults = require("../db/saveDbResults");

const getEmailLabelAndBody = (authArr, email, auth, dbEmails, fromDb) => {
  const dbEmailsArr = dbEmails.map(item => item.email);
  const result = { email, labels: [], body: [] };

  return new Promise((resolve, reject) => {
    // if return data from database
    if (fromDb && dbEmailsArr.includes(email)) {
      const dbItem = dbEmails.filter(item => item.email === email).map(item => {
        const { email, labels, body } = item;
        return { email, labels, body };
      })[0];
      resolve(dbItem);
    }

    // if get data from GMAIL
    else {
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
                  result[emailArr.indexOf(email)].body.push(body);
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
                          result[emailArr.indexOf(email)].labels.push(
                            res.data.name
                          );
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
          await saveDbResults(result[emailArr.indexOf(email)]);
          resolve(result);
        }
      ); // LOOP ACCOUNTS finish
    }
  });
};

module.exports = getEmailLabelAndBody;
