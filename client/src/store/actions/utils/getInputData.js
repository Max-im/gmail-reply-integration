import axios from "axios";
import asyncLoop from "node-async-loop";

export const getInputData = (fileId, sheetName) => {
  return new Promise(async (resolve, reject) => {
    // get input data
    const sheetData = await getSheetData(fileId, sheetName);

    // get all labels
    const labels = await getLabels();

    // get accounts
    const accoutnsData = await getAccountsData();

    // get all threads
    const threads = await getAllThreads(accoutnsData, labels);
    console.log(threads.length, "got from gmail");

    resolve({ sheetData, threads });
  });
};

// get sheet data
function getSheetData(fileId, sheetName) {
  return new Promise((resolve, reject) => {
    axios
      .get(`/input/${fileId}/${sheetName}`)
      .then(res => resolve(res.data))
      .catch(err => reject(err));
  });
}

// get Labels
function getLabels() {
  return new Promise((resolve, reject) => {
    axios
      .get("/labels")
      .then(res => resolve(res.data))
      .catch(err => reject(err));
  });
}

// get accounts
function getAccountsData() {
  return new Promise((resolve, reject) => {
    axios
      .get("/accounts")
      .then(res => resolve(res.data))
      .catch(err => reject(err));
  });
}

// get all the threads
function getAllThreads(accountsArr, labels) {
  // construct query for getting target threads
  const labelNames = labels.map(label => label.name);
  const exclude = ["!SENT", "!pierre.martinow@idealsmail.com"];
  const queryArr = labelNames
    .filter(item => !exclude.includes(item))
    .map(item => {
      if (item.indexOf(" ") === -1) {
        return `label:${item}`;
      } else {
        return `label:"${item}"`;
      }
    });
  const query = `{${queryArr.join(" ")}}`;

  // loop arr
  const arr = [];
  for (var i = 0; i < 50; i++) {
    arr.push(i);
  }

  // result arr
  const threadsArr = [];

  return new Promise((resolve, reject) => {
    // loop each account
    asyncLoop(
      accountsArr,
      (account, nextAccount) => {
        let isDone = false;

        const accountArr = []; // account result arr
        const options = { userId: "me", maxResults: 500, q: query };
        const id = account._id;

        // loop each page
        asyncLoop(
          arr,
          (page, nextPage) => {
            if (isDone) return nextPage();

            axios
              .post(`/integration/get-all-account-threads`, {
                options,
                id
              })
              .then(res => {
                const { threads, nextPageToken } = res.data;

                if (threads) {
                  // save account id to get accoutn credentials for create or update
                  accountArr.push(...threads.map(i => ({ ...i, uId: id })));
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
            // save account results in total results
            console.log(account.email, accountArr.length);
            threadsArr.push(...accountArr);
            nextAccount();
          }
        );
      },
      () => resolve(threadsArr)
    );
  });
}
