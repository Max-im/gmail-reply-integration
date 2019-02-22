import axios from "axios";
import {
  ADD_INFO,
  CLOSE_INFO,
  ERROR_EMIT,
  UPLOAD_PROGRESS
} from "../constants";

// Set up Auth axios header
export const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// add info on screen
export const addInfo = (payload, dispatch) => {
  dispatch({ type: ADD_INFO, payload });
  setTimeout(() => {
    dispatch({ type: CLOSE_INFO, payload });
  }, 6000);
};

// error show
export const addError = (err, dispatch) => {
  if (
    err &&
    err.response &&
    err.response.data &&
    err.response.data.error &&
    err.response.data.error.message
  ) {
    dispatch({ type: ERROR_EMIT, payload: err.response.data.error.message });
  } else if (
    err &&
    err.response &&
    err.response.data &&
    typeof err.response.data === "string"
  ) {
    dispatch({ type: ERROR_EMIT, payload: err.response.data });
  } else if (err && typeof err === "string") {
    dispatch({ type: ERROR_EMIT, payload: err });
  } else {
    console.error(err);
  }
};

// show info each 20 time
export const showInfoLoop = (counter, newThreads, inDb, dispatch) => {
  const persent = Math.round(
    ((counter + inDb.length) / (newThreads.length + inDb.length)) * 100
  );

  dispatch({ type: UPLOAD_PROGRESS, payload: persent + "%" });
  if (counter % 20 === 0) {
    addInfo(
      `Handled ${persent}% ( ${counter + inDb.length} from ${newThreads.length +
        inDb.length} )`,
      dispatch
    );
  }
};
