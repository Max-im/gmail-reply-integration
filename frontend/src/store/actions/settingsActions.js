import axios from "axios";
import {
  GET_ACCOUNTS,
  GET_LABELS,
  ERROR_EMIT,
  START_PROCESS,
  END_PROCESS
} from "./constants";

import {
  getAccountThreads,
  retrieveThreadsData,
  storeThreadsInDb
} from "./utils/settings";

import { addInfo } from "./utils/general";

// Get Accounts
export const getAccoutns = () => dispatch => {
  axios
    .get("/settings/accounts")
    .then(res => {
      dispatch({ type: GET_ACCOUNTS, payload: res.data });
      dispatch({ type: END_PROCESS });
    })
    .catch(err => console.error(err.response.data));
};

// Create Account
export const createAccount = () => () => {
  axios
    .get("/settings/accounts/google")
    .then(res => (window.location.href = res.data.url))
    .catch(err => console.error(err.response.data));
};

// upload Account Data
export const uploadAccountData = id => async dispatch => {
  dispatch({ type: START_PROCESS });

  try {
    // get all threads ids
    const threadsIdArr = await getAccountThreads(id);

    // retrieve data each of the thread
    const threadsData = await retrieveThreadsData(threadsIdArr, id, dispatch);

    // store data in db
    await storeThreadsInDb(threadsData);

    addInfo(`The Data is Stored`, dispatch);

    dispatch(getAccoutns());
  } catch (err) {
    dispatch({ type: ERROR_EMIT, payload: JSON.stringify(err) });
  }
  dispatch({ type: END_PROCESS });
};

// remove Account
export const removeAccount = id => dispatch => {
  if (!window.confirm("Do you want to Remove the Account?")) return;
  dispatch({ type: START_PROCESS });
  axios
    .delete(`/settings/accounts/${id}`)
    .then(res => {
      dispatch(getAccoutns());
      dispatch(getLabels());
    })
    .catch(err => {
      dispatch({ type: END_PROCESS });
      console.log(err.response.data);
    });
};

// get all gmail labels
export const getLabels = () => dispatch => {
  axios
    .get("/settings/labels")
    .then(res => {
      dispatch({ type: GET_LABELS, payload: res.data });
      dispatch({ type: END_PROCESS });
    })
    .catch(err => console.log(err));
};

// toggle label action
export const toggleLabelAction = (id, value) => dispatch => {
  dispatch({ type: START_PROCESS });
  axios
    .post("/settings/labels", { id, value })
    .then(res => dispatch(getLabels()))
    .catch(err => {
      dispatch({ type: END_PROCESS });
      console.log(err.response.data);
    });
};
