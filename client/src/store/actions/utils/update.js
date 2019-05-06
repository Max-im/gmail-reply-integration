import axios from "axios";
import { errorHandle } from "./errorHandle";

import {
  ADD_INFO,
  TOGGLE_PROGRESS,
  CHANGE_PROGRESS,
  CONNECT_NEED_TO_CREATE,
  CONNECT_NEED_TO_UPDATE,
  CONNECT_NEED_TO_DELETE
} from "../constants";
import store from "../../store";

const { getState } = store;

/** ======================================================================
 * @description compares db threads with new fetched gmail threads retrieves needToCreate, needToUpdate and needToDelete arrs
 * @success dispatches needToCreate, needToUpdate and needToDelete into "connect" store
 */
export const compareThreadsWithDb = () => dispatch => {
  const { dbThreads, gmailThreads } = getState().connect;

  const dbIds = dbThreads.map(item => item.id);
  const threadIds = gmailThreads.map(item => item.id);

  // need to create
  const needToCreate = gmailThreads.filter(item => !dbIds.includes(item.id));
  if (needToCreate.length > 0) {
    dispatch({ type: CONNECT_NEED_TO_CREATE, payload: needToCreate });
    const msg = `Need to create ${needToCreate.length} threads`;
    dispatch({ type: ADD_INFO, payload: msg });
  }

  // need to update
  const needToUpdate = gmailThreads.filter(item => {
    const dbItem = dbThreads.find(db => db.id === item.id);
    if (!dbItem) return false;
    return dbItem.historyId !== item.historyId;
  });
  if (needToUpdate.length > 0) {
    dispatch({ type: CONNECT_NEED_TO_UPDATE, payload: needToUpdate });
    const msg = `Need to update ${needToUpdate.length} threads`;
    dispatch({ type: ADD_INFO, payload: msg });
  }

  // need to delete
  const needToDelete = dbThreads.filter(item => !threadIds.includes(item.id));
  if (needToDelete.length > 0) {
    dispatch({ type: CONNECT_NEED_TO_DELETE, payload: needToDelete });
  }
};

/** ======================================================================
 * @description remove old threads from db
 */
export const removeOldDbThreads = () => {
  const removeIdArr = getState().connect.needToDelete.map(item => item.id);
  return axios
    .post(`/integration/delete-thread`, { removeIdArr })
    .catch(err => errorHandle(err, "Error removing old db threads"));
};

/** ======================================================================
 * @description Loop threads for Creating or updating depends on method
 * @argument {string} method can be one of "Create" or "Update" because theese are names of "connect" store and backend API
 */
export const createOrUpdate = method => async dispatch => {
  const arr = getState().connect[`needTo${method}`];
  const count = counter();
  const len = arr.length;

  for (let thread of arr) {
    await dispatch(createOrUpdateItem(method, thread));
    // update progress bar
    const progress = count();
    const payload = (progress / len) * 100;
    const meta = `${method}d ${progress} from ${len} threads`;
    dispatch({ type: CHANGE_PROGRESS, payload, meta });
  }
};

/** ======================================================================
 * @description Creat or update depends on method
 * @argument {string} method can be one of "Create" or "Update" because theese are names of "connect" store and backend API
 */
export const createOrUpdateItem = (method, thread) => dispatch => {
  return axios.post(`/integration/${method}-thread`, { thread }).catch(err => {
    dispatch({ type: TOGGLE_PROGRESS, payload: false });
    dispatch({ type: CHANGE_PROGRESS, payload: 0, meta: "" });
    errorHandle(err, `Error ${method} thread ${thread.id}`);
  });
};

const counter = () => {
  let count = 0;
  return () => count++;
};
