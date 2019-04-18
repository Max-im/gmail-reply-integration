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

// v5
//=======================================

// get all the threads
export const getAllThreads = accounts => {
  const threadsArr = [];

  const arr = [];
  for (var i = 0; i < 100; i++) {
    arr.push(i);
  }

  return new Promise((resolve, reject) => {
    // loop each account
    asyncLoop(
      accounts,
      (account, nextAccount) => {
        let isDone = false;
        let isNewAccount = true;
        const options = {
          userId: "me",
          maxResults: 500,
          q: "has:userlabels and label:inbox"
        };
        const accountThreads = [];
        const id = account._id;
        // loop each page
        asyncLoop(
          arr,
          (page, nextPage) => {
            if (isDone) return nextPage();

            axios
              .post(`/integration/get-all-account-threads`, {
                options,
                isNewAccount,
                id
              })
              .then(res => {
                const { threads, nextPageToken } = res.data;

                if (isNewAccount) isNewAccount = false;
                if (threads) {
                  accountThreads.push(...threads.map(i => ({ ...i, uId: id })));
                }
                if (nextPageToken) {
                  options.pageToken = nextPageToken;
                  nextPage();
                } else {
                  isDone = true;
                  nextPage();
                }
              })
              .catch(err => reject(err));
          },
          () => {
            console.log(accountThreads.length, account.email, "threads");
            threadsArr.push(...accountThreads);
            nextAccount();
          }
        );
      },
      () => resolve(threadsArr)
    );
  });
};

// retrieve updated threads only
export const compareThreadsWithDb = (threads, dbThreads) => {
  const dbIds = dbThreads.map(item => item.id);
  const threadIds = threads.map(item => item.id);

  const needToCreate = threads.filter(item => !dbIds.includes(item.id));
  const needToRemove = dbThreads.filter(item => !threadIds.includes(item.id));
  const needToUpdate = threads.filter(item => {
    const dbItem = dbThreads.find(db => db.id === item.id);
    if (!dbItem) return false;
    return dbItem.historyId !== item.historyId;
  });

  return { needToCreate, needToUpdate, needToRemove };
};

export const removeOldDbThreads = needToRemove => {
  return new Promise((resolve, reject) => {
    const removeIdArr = needToRemove.map(item => item.id);
    axios
      .post(`/integration/delete-thread`, { removeIdArr })
      .then(() => resolve())
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};

// create new threads
export const createDbThreads = needToCreate => {
  return new Promise((resolve, reject) => {
    asyncLoop(
      needToCreate,
      (thread, nextThread) => {
        axios
          .post("/integration/create-thread", { thread })
          .then(() => nextThread())
          .catch(err => {
            console.log(err);
            reject(err);
          });
      },
      () => resolve()
    );
  });
};

// update existing threads
export const updateDbThreads = needToUpdate => {
  return new Promise((resolve, reject) => {
    asyncLoop(
      needToUpdate,
      (thread, nextThread) => {
        axios
          .post("/integration/update-thread", { thread })
          .then(() => nextThread())
          .catch(err => {
            console.log(err);
            reject(err);
          });
      },
      () => resolve()
    );
  });
};

// get all threads from db
export const getDbThreads = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("/integration/get-db-threads")
      .then(res => resolve(res.data))
      .catch(err => reject(err));
  });
};

// filter target threads
export const compareInputData = (actualThreads, emailArr, labels) => {
  // filter by people
  const byPeople = emailArr.map(item => {
    return actualThreads.filter(thread => thread.people.includes(item));
  });

  // construct labels ids
  const targetLabelsIds = labels.map(label => label.id);

  // filater by labels
  const byLabels = byPeople.map(threadsArr => {
    if (threadsArr.length === 0) return [];
    return threadsArr
      .filter(thread =>
        thread.labels.some(label => targetLabelsIds.includes(label))
      )
      .map(thread => ({
        ...thread,
        labels: thread.labels
          .filter(label => targetLabelsIds.includes(label))
          .map(label => labels.find(dbLab => dbLab.id === label).name)
      }));
  });
  return byLabels;
};

export const formatOutput = targetThreads => {
  const formated = targetThreads.map(threadsArr => {
    const theItem = [];
    const body = [];
    const labels = [];

    threadsArr.forEach(item => {
      body.push(...item.body);
      labels.push(...item.labels);
    });
    theItem.push(body, labels);
    return theItem;
  });
  return formated;
};

// get labels map
export const getAccountsLabels = threads => {
  return new Promise((resolve, reject) => {
    axios
      .get("/integration/target-labels-map")
      .then(res => resolve(res.data))
      .catch(err => reject(err));
  });
};
