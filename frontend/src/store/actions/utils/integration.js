import axios from "axios";
import asyncLoop from "node-async-loop";
import { getAccountLabels } from "./settings";

// format data for output
export const formateIntegrationData = result => {
  const formated = [];

  result.forEach(item => {
    const theItem = [];

    // body
    const body = [];
    item.forEach(thread => body.push(thread.body));

    // labels
    const labels = [];
    item.forEach(thread =>
      thread.labels.forEach(label => {
        if (!labels.includes(label)) labels.push(label);
      })
    );

    theItem[0] = body.join("\n===============\n");
    theItem.push(...labels.map(item => item));
    formated.push(theItem);
  });

  // header
  let maxLen = 1;
  formated.forEach(item => {
    if (item.length > maxLen) maxLen = item.length;
  });
  const header = ["Body"];
  for (var i = 1; i < maxLen; i++) {
    header.push("Label-" + i);
  }
  formated.unshift(header);

  const resultArr = formated.map(item => {
    const forReturn = [];
    const theItem = item.filter(arr => arr.length > 0);
    for (var i = 0; i < maxLen; i++) {
      if (theItem[i]) {
        forReturn.push(theItem[i]);
      } else {
        forReturn.push("");
      }
    }
    return forReturn;
  });

  return resultArr;
};

// update accounts
export const updateAccounts = accounts => {
  const arr = [];
  for (var i = 0; i < 10000; i++) {
    arr.push(i);
  }

  return new Promise((resolve, reject) => {
    asyncLoop(
      accounts,
      async (account, nextAccount) => {
        const options = { userId: "me", maxResults: 20 };
        const labels = await getAccountLabels(account._id);
        let histId = false;
        // console.log(labels);
        asyncLoop(arr, (page, nextPage) => {
          // console.log(page);
          axios
            .post("/integration/update/", {
              id: account._id,
              options,
              labels
            })
            .then(res => {
              console.log(res.data);
              const { nextPageToken, historyId } = res.data;
              if (!histId) histId = historyId;
              if (nextPageToken) {
                options.pageToken = nextPageToken;
                nextPage();
              } else {
                // update historyId
                axios
                  .post("/integration/update-history", {
                    historyId: histId,
                    id: account._id
                  })
                  .then(() => nextAccount())
                  .catch();
              }
            })
            .catch(err => reject(err));
        });
      },
      () => resolve()
    );
  });
};
