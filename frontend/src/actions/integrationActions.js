import axios from "axios";

import {
  GET_SHEETS_NAMES,
  SPINNER_TOGGLE,
  ERROR_EMIT,
  UPDATE_PROGRESS_BAR,
  SUCCESS_EMIT
} from "./constants";

const httpClient = axios.create();
httpClient.defaults.timeout = 1000 * 60 * 60 * 10;
let interval;

// Get Sheets Names
export const onGetFileSheets = fileId => dispatch => {
  httpClient
    .get(`/integration/sheets/${fileId}`)
    .then(res => {
      dispatch({ type: GET_SHEETS_NAMES, payload: res.data });
    })
    .catch(err => {
      dispatch({ type: ERROR_EMIT, payload: err.response.data });
    });
};

export const onProgressCheck = () => dispatch => {
  interval = setInterval(() => {
    httpClient
      .get("/integration/progress")
      .then(res => {
        const { progress, status } = res.data;
        if (status === "Done") {
          dispatch({
            type: UPDATE_PROGRESS_BAR,
            payload: { status: false, progress }
          });
          clearInterval(interval);
          dispatch({
            type: SUCCESS_EMIT,
            payload: "Integration done success!"
          });
          dispatch({ type: SPINNER_TOGGLE, payload: false });
        } else {
          dispatch({
            type: UPDATE_PROGRESS_BAR,
            payload: { status, progress }
          });
        }
      })
      .catch(err => {
        if (err.response && err.response.data) {
          dispatch({ type: SPINNER_TOGGLE, payload: false });
          dispatch({ type: ERROR_EMIT, payload: err.response.data });
        } else {
          Object.keys(err).map(key => console.log(key, err[key]));
        }
      });
  }, 1000);
};

// Hide Sheet Names
export const onHideSheetsNames = () => dispatch => {
  dispatch({ type: GET_SHEETS_NAMES, payload: null });
};

// NEW LAUNCH
export const integrationLaunch = sheetData => dispatch => {
  // show spinner, hide success msg
  dispatch({ type: SPINNER_TOGGLE, payload: true });
  dispatch({ type: SUCCESS_EMIT, payload: false });
  dispatch({ type: ERROR_EMIT, payload: false });
  dispatch({
    type: UPDATE_PROGRESS_BAR,
    payload: { status: false, progress: false }
  });
  const firstTime = Date.now();

  httpClient
    .post("/integration/launch", sheetData)
    .then(res => {
      // hide spinner
      dispatch({ type: SPINNER_TOGGLE, payload: false });
      dispatch({
        type: UPDATE_PROGRESS_BAR,
        payload: { status: false, progress: false }
      });
      clearInterval(interval);

      // success
      dispatch({ type: SUCCESS_EMIT, payload: "Integration done success!" });
    })
    .catch(err => {
      if (err.response && err.response.data) {
        console.log(err.response.data);
        dispatch({ type: SPINNER_TOGGLE, payload: false });
        dispatch({ type: ERROR_EMIT, payload: err.response.data });
      } else if (err.code === "ECONNABORTED") {
        const lastTime = Date.now();
        console.log(lastTime - firstTime, "timeout axios finish");
      } else {
        Object.keys(err).map(key => console.log(key, err[key]));
      }
    });
};
