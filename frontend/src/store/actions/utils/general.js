import axios from "axios";
import keygen from "keygenerator";
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
  console.error(err);
  if (
    err &&
    err.response &&
    err.response.data &&
    err.response.data.error &&
    err.response.data.error.message
  ) {
    dispatch({
      type: ERROR_EMIT,
      payload: { value: err.response.data.error.message, id: keygen._() }
    });
  } else if (
    err &&
    err.response &&
    err.response.data &&
    typeof err.response.data === "string"
  ) {
    dispatch({
      type: ERROR_EMIT,
      payload: { value: err.response.data, id: keygen._() }
    });
  } else if (err && typeof err === "string") {
    dispatch({ type: ERROR_EMIT, payload: { value: err, id: keygen._() } });
  }
};

// show info each 20 time
export const showInfoLoop = (counter, newThreads, inDb, dispatch) => {
  const persent = Math.round(
    ((counter + inDb.length) / (newThreads.length + inDb.length)) * 100
  );

  if (counter % 20 === 0) {
    dispatch({ type: UPLOAD_PROGRESS, payload: persent + "%" });
    addInfo(
      `Handled ${persent}% ( ${counter + inDb.length} from ${newThreads.length +
        inDb.length} )`,
      dispatch
    );
  }
};
