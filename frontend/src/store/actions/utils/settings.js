import axios from "axios";
import asyncLoop from "node-async-loop";
import { addInfo, showInfoLoop } from "./general";

// get all threads ids
export const getAccountThreads = id => {
  return new Promise((resolve, reject) => {
    axios
      .post("/settings/upload-account", { id })
      .then(res => resolve(res.data))
      .catch(err => reject(err));
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
      (thread, nextThread) => {
        counter++;
        showInfoLoop(counter, newThreads, inDb, dispatch);

        axios
          .get(`/settings/get-thread-data/${thread.id}/${id}`)
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
        const newThreads = threads.filter(item => !res.data.includes(item.id));
        resolve({ newThreads, inDb: res.data });
      })
      .catch(err => reject(err));
  });
};
