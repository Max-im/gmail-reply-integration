import axios from "axios";
import asyncLoop from "node-async-loop";
import { addInfo } from "./general";

// get all threads ids
export const getAccountThreads = id => {
  return new Promise((resolve, reject) => {
    axios
      .post("/settings/upload-account", { id })
      .then(res => resolve(res.data))
      .catch(err => {
        reject("Error getting threads");
        console.log(err.response.data);
      });
  });
};

// retrieve data each of the thread
export const retrieveThreadsData = (threads, id, dispatch) => {
  return new Promise((resolve, reject) => {
    const threadData = [];
    addInfo(`Got ${threads.length} threads`, dispatch);
    addInfo(`Start fetching the threads data`, dispatch);

    let counter = 0;
    asyncLoop(
      threads,
      (thread, nextThread) => {
        counter++;
        if (counter % 20 === 0) {
          addInfo(
            `Handled ${Math.round(
              (counter / threads.length) * 100
            )}% ( ${counter} from ${threads.length} )`,
            dispatch
          );
        }
        axios
          .get(`/settings/get-thread-data/${thread.id}/${id}`)
          .then(res => {
            threadData.push(res.data);
            nextThread();
          })
          .catch(err => {
            console.log(err);
            reject(err.response.data);
          });
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
      .catch(err => {
        reject("Error saving in db");
        console.log(err.response.data);
      });
  });
};
