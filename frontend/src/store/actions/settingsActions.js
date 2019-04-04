import axios from "axios";
import {
  GET_ACCOUNTS,
  GET_LABELS,
  START_PROCESS,
  UPLOAD_PROGRESS,
  END_PROCESS
} from "./constants";

import {
  getAccountThreads,
  retrieveThreadsData,
  storeThreadsInDb,
  filterNewThreads,
  getAccountLabels
} from "./utils/settings";

import { addInfo, addError } from "./utils/general";

// Get Accounts
export const getAccounts = bool => dispatch => {
  axios
    .get("/settings/accounts")
    .then(res => {
      dispatch({ type: GET_ACCOUNTS, payload: res.data });
      if (bool) dispatch({ type: END_PROCESS });
    })
    .catch(err => addError(err, dispatch));
};

// Create Account
export const createAccount = () => dispatch => {
  axios
    .get("/settings/accounts/google")
    .then(res => (window.location.href = res.data.url))
    .catch(err => addError(err, dispatch));
};

// upload Account Data
export const uploadAccountData = id => async dispatch => {
  try {
    dispatch({ type: START_PROCESS });
    dispatch({ type: UPLOAD_PROGRESS, payload: "0%" });

    // get account labels
    // labels - an array contains all ids labels type === "user"
    const labels = await getAccountLabels(id);
    addInfo("Get labels " + labels.length, dispatch);

    // get all threads ids, labeled by "user" labels
    const threadsIdArr = await getAccountThreads(id, labels, dispatch);
    addInfo("Get threads " + threadsIdArr.length, dispatch);

    // filter new threads
    const { newThreads, inDb } = await filterNewThreads(threadsIdArr, id);
    addInfo("New threads " + newThreads.length, dispatch);

    // retrieve data each of the thread
    const options = { newThreads, id, inDb, dispatch };
    const threadsData = await retrieveThreadsData(options);

    // store data in db
    await storeThreadsInDb(threadsData);
    addInfo(`The Data is Stored`, dispatch);
    dispatch(getAccounts());
  } catch (err) {
    addError(err, dispatch);
  }
  dispatch({ type: END_PROCESS });
};

// get all gmail labels
export const getLabels = () => dispatch => {
  axios
    .get("/settings/labels")
    .then(res => {
      dispatch({ type: GET_LABELS, payload: res.data });
      dispatch({ type: END_PROCESS });
    })
    .catch(err => addError(err, dispatch));
};

// remove Account
export const removeAccount = id => dispatch => {
  if (!window.confirm("Do you want to Remove the Account?")) return;
  dispatch({ type: START_PROCESS });
  axios
    .delete(`/settings/accounts/${id}`)
    .then(() => dispatch(getAccounts()))
    .catch(err => {
      dispatch({ type: END_PROCESS });
      addError(err, dispatch);
    });
};

// toggle label action
export const toggleLabelAction = (id, value) => dispatch => {
  dispatch({ type: START_PROCESS });
  axios
    .post("/settings/labels", { id, value })
    .then(() => dispatch(getLabels()))
    .catch(err => {
      dispatch({ type: END_PROCESS });
      addError(err, dispatch);
    });
};
