import axios from "axios";

import {
  GET_SHEETS_NAMES,
  SPINNER_TOGGLE,
  ERROR_EMIT,
  UPDATE_PROGRESS_BAR,
  SUCCESS_EMIT
} from "./constants";

let interval;

// Get Sheets Names
export const onGetFileSheets = fileId => dispatch => {
  axios
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
    axios
      .get("/integration/progress")
      .then(res => {
        const { done, status, checkLength } = res.data;
        const progress = done / checkLength;
        if (status === "Done") {
          dispatch({
            type: UPDATE_PROGRESS_BAR,
            payload: { status: false, progress: false }
          });
          clearInterval(interval);
        } else {
          dispatch({
            type: UPDATE_PROGRESS_BAR,
            payload: { status, progress }
          });
        }
      })
      .catch(err => console.log(err.response.data));
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

  axios
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
      // hide spinner
      dispatch({ type: SPINNER_TOGGLE, payload: false });
      // error emit
      dispatch({ type: ERROR_EMIT, payload: err.response.data });
    });
};
