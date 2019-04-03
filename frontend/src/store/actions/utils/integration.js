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

        asyncLoop(arr, (page, nextPage) => {
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

// compare results
export const compareResults = emailArr => {
  console.log(emailArr);
  return new Promise(async (resolve, reject) => {
    const { data: labels } = await axios
      .get("/integration/labels")
      .catch(err => reject(err));

    const labelNames = labels
      .filter(item => item.type === "check")
      .map(item => item.name);

    console.log("labelNames", labelNames);

    const { data: threads } = await axios
      .post("/integration/compare", { emailArr })
      .catch(err => reject(err));

    console.log("threads", threads);

    const mapped = emailArr.map(email => {
      const matchedThreads = threads
        // filter all matched
        .filter(item => {
          if (item.people.some(person => person === email)) return true;
          return false;
        })
        // map body and labels
        .map(item => ({ body: item.body, labels: item.labels }));
      return matchedThreads;
    });

    console.log("mapped", mapped);

    // filter by "check" labels
    const threadArr = mapped.map(item =>
      item
        .filter(thread =>
          thread.labels.some(label => labelNames.includes(label))
        )
        .map(item => ({
          body: item.body,
          labels: item.labels.filter(label => labelNames.includes(label))
        }))
    );

    console.log("threadArr", threadArr);

    resolve(threadArr);
  });
};

// output data
// output each column separatly, for reduce server load time
export const outputData = (formated, fileId, sheetName) => {
  const arr = [];
  for (var i = 0; i < formated[0].length; i++) {
    arr.push(i);
  }

  return new Promise((resolve, reject) => {
    asyncLoop(
      arr,
      (col, nextCol) => {
        const data = formated.map(item => item[col]);
        axios
          .post("/integration/sheet", { fileId, sheetName, data })
          .then(() => nextCol())
          .catch(err => reject(err));
      },
      () => resolve()
    );
  });
};
