import axios from "axios";
import asyncLoop from "node-async-loop";
import { getDbThreads } from "./integration";
import { ADD_INFO } from "../constants";

export const update = (threads, dbThreads, dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const compareResult = compareThreadsWithDb(threads, dbThreads);
      const { needToCreate, needToUpdate, needToRemove } = compareResult;

      // remove old
      if (needToRemove.length > 0) {
        const payload = `Need to remove ${needToRemove.length} threads`;
        dispatch({ type: ADD_INFO, payload });
        await removeOldDbThreads(needToRemove);
      }

      // create new
      if (needToCreate.length > 0) {
        const payload = `Need to create ${needToCreate.length} threads`;
        dispatch({ type: ADD_INFO, payload });
        await createDbThreads(needToCreate);
      }

      // update db data
      if (needToUpdate.length > 0) {
        const payload = `Need to update ${needToUpdate.length} threads`;
        dispatch({ type: ADD_INFO, payload });
        await updateDbThreads(needToUpdate);
      }

      // get gb threads
      const idUpdated = needToCreate.length === 0 && needToUpdate.length === 0;
      const actualThreads = idUpdated ? await getDbThreads() : dbThreads;
      dispatch({ type: ADD_INFO, payload: "All data is updated" });

      resolve(actualThreads);
    } catch (err) {
      reject(err);
    }
  });
};

// retrieve updated threads only
function compareThreadsWithDb(threads, dbThreads) {
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
}

// remove old db threads
function removeOldDbThreads(needToRemove) {
  return new Promise((resolve, reject) => {
    const removeIdArr = needToRemove.map(item => item.id);
    axios
      .post(`/integration/delete-thread`, { removeIdArr })
      .then(() => resolve())
      .catch(err => reject(err));
  });
}

// create new threads
function createDbThreads(needToCreate) {
  return new Promise((resolve, reject) => {
    asyncLoop(
      needToCreate,
      (thread, nextThread) => {
        axios
          .post("/integration/create-thread", { thread })
          .then(() => nextThread())
          .catch(err => reject(err));
      },
      () => resolve()
    );
  });
}

// update existing threads
function updateDbThreads(needToUpdate) {
  return new Promise((resolve, reject) => {
    asyncLoop(
      needToUpdate,
      (thread, nextThread) => {
        axios
          .post("/integration/update-thread", { thread })
          .then(() => nextThread())
          .catch(err => reject(err));
      },
      () => resolve()
    );
  });
}
