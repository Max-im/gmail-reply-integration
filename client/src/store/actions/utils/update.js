import axios from "axios";
import asyncLoop from "node-async-loop";
import { getDbThreads } from "./integration";
import { ADD_INFO, TOGGLE_PROGRESS, CHANGE_PROGRESS } from "../constants";

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
        await createOrUpdate(needToCreate, "create", dispatch);
      }

      // update db data
      if (needToUpdate.length > 0) {
        const payload = `Need to update ${needToUpdate.length} threads`;
        dispatch({ type: ADD_INFO, payload });
        await createOrUpdate(needToUpdate, "update", dispatch);
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

// create or update threads
function createOrUpdate(arr, method, dispatch) {
  let progressCounter = 0;
  dispatch({ type: CHANGE_PROGRESS, payload: 0, meta: "" });
  if (arr.length > 20) dispatch({ type: TOGGLE_PROGRESS, payload: true });

  return new Promise((resolve, reject) => {
    asyncLoop(
      arr,
      (thread, nextThread) => {
        axios
          .post(`/integration/${method}-thread`, { thread })
          .then(() => {
            // change progress bar
            progressCounter++;
            dispatch({
              type: CHANGE_PROGRESS,
              payload: (progressCounter / arr.length) * 100,
              meta: `${method}d ${progressCounter} from ${arr.length} threads`
            });
            nextThread();
          })
          .catch(err => {
            dispatch({ type: TOGGLE_PROGRESS, payload: false });
            dispatch({ type: CHANGE_PROGRESS, payload: 0, meta: "" });
            reject(err);
          });
      },
      () => {
        dispatch({ type: TOGGLE_PROGRESS, payload: false });
        resolve();
      }
    );
  });
}
