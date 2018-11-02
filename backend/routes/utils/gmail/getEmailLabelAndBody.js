const { google } = require("googleapis");
const asyncLoop = require("node-async-loop");

const saveMailId = require("./saveMailId");
const saveBodyAndLabels = require("./saveBodyAndLabels");
const saveDbResults = require("../db/saveDbResults");

const getEmailLabelAndBody = (
  authArr,
  emailArr,
  auth,
  progressIntegration,
  dbEmails,
  fromDb
) => {
  const dbEmailsArr = dbEmails.map(item => item.email);
  const result = emailArr.map(item => ({
    email: item,
    labels: [],
    body: []
  }));

  return new Promise((resolve, reject) => {
    // LOOP EMAILS
    asyncLoop(
      emailArr,
      async (email, nextEmail) => {
        // if return data from database
        if (fromDb && dbEmailsArr.includes(email)) {
          const dbItem = dbEmails
            .filter(item => item.email === email)
            .map(item => {
              const { email, labels, body } = item;
              return { email, labels, body };
            })[0];
          result[emailArr.indexOf(email)] = dbItem;

          progressIntegration.progress =
            emailArr.indexOf(email) / emailArr.length;
          progressIntegration.status = `Checking Email ${emailArr.indexOf(
            email
          )} from ${emailArr.length} `;
          nextEmail();
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
                    const { labels, body } = await saveBodyAndLabels(
                      auth,
                      msgId
                    );
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
              progressIntegration.progress =
                emailArr.indexOf(email) / emailArr.length;
              progressIntegration.status = `Checking Email ${emailArr.indexOf(
                email
              )} from ${emailArr.length}`;
              // save each email in db
              await saveDbResults(result[emailArr.indexOf(email)]);
              nextEmail();
            }
          ); // LOOP ACCOUNTS finish
        }
      },

      // LOOP EMAILS callback
      () => {
        resolve(
          // return only uniq labels
          result.map(item => ({
            ...item,
            labels: item.labels.filter((v, i, a) => a.indexOf(v) === i)
          }))
        );
      }
    ); // LOOP EMAILS finish
  });
};

module.exports = getEmailLabelAndBody;
