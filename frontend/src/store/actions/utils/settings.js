import axios from "axios";
import asyncLoop from "node-async-loop";
import { addInfo, showInfoLoop } from "./general";

// get account labels
export const getAccountLabels = id => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/settings/account-labels/${id}`)
      .then(res => resolve(res.data))
      .catch(err => reject(err));
  });
};

// get all threads ids
export const getAccountThreads = (id, labels) => {
  const arr = [];
  for (var i = 0; i < 1000; i++) {
    arr.push(i);
  }
  const result = [];
  return new Promise((resolve, reject) => {
    asyncLoop(
      labels,
      (labelId, nextLabel) => {
        const options = { userId: "me", maxResults: 500, labelIds: [labelId] };

        asyncLoop(arr, (page, nextPage) => {
          axios
            .post("/settings/upload-account", { id, options })
            .then(res => {
              const { nextPageToken, threads } = res.data;
              if (threads && threads.length > 0) {
                result.push(...threads);
              }
              if (nextPageToken) {
                options.pageToken = nextPageToken;
                nextPage();
              } else {
                return nextLabel();
              }
            })
            .catch(err => reject(err));
        });
      },
      () => {
        const uniq = result
          .map(item => item.id)
          .filter(item => item)
          .filter((v, i, a) => a.indexOf(v) === i);
        resolve(uniq);
      }
    );
  });
};

// retrieve data each of the thread
export const retrieveThreadsData = ({ newThreads, id, inDb, dispatch }) => {
  return new Promise((resolve, reject) => {
    const threadData = [];
    addInfo(`Got ${newThreads.length + inDb.length} threads`, dispatch);
    addInfo(`Start fetching the threads data`, dispatch);

    let counter = 0;
    asyncLoop(
      newThreads,
      (threadId, nextThread) => {
        counter++;
        showInfoLoop(counter, newThreads, inDb, dispatch);
        axios
          .get(`/settings/get-thread-data/${threadId}/${id}`)
          .then(res => {
            threadData.push(res.data);
            nextThread();
          })
          .catch(err => reject(err));
      },
      () => resolve(threadData)
    );
  });
};

// store data in db
export const storeThreadsInDb = threadData => {
  return new Promise((resolve, reject) => {
    axios
      .post("/settings/store-uploaded", { threadData })
      .then(() => resolve())
      .catch(err => reject(err));
  });
};

// filter new threads
export const filterNewThreads = (threads, id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/settings/get-db-threads/${id}`)
      .then(res => {
        const newThreads = threads.filter(item => !res.data.includes(item));
        resolve({ newThreads, inDb: res.data });
      })
      .catch(err => reject(err));
  });
};
