import axios from "axios";
import asyncLoop from "node-async-loop";

import {
  GET_SHEETS_NAMES,
  SPINNER_TOGGLE,
  ERROR_EMIT,
  UPDATE_PROGRESS_BAR,
  SUCCESS_EMIT
} from "./constants";

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
    .post("/integration/get-emails-list", sheetData)
    .then(res => {
      const { emailArr, tabLen } = res.data;
      const result = [];
      asyncLoop(
        emailArr,
        (email, nextEmail) => {
          axios
            .post("/integration/get-email-data", { ...sheetData, email })
            .then(res => {
              result.push(res.data);
              dispatch({
                type: UPDATE_PROGRESS_BAR,
                payload: {
                  status: `Checked ${result.length} from ${
                    emailArr.length
                  } emails.`,
                  progress: result.length / emailArr.length
                }
              });
              nextEmail();
            })
            .catch(err => console.log(err.response.data));
        },
        () => {
          // output data
          axios
            .post("/integration/output-data", { result, tabLen, ...sheetData })
            .then(res => {
              dispatch({ type: SPINNER_TOGGLE, payload: true });
              dispatch({
                type: SUCCESS_EMIT,
                payload: "Integration done success!"
              });
            })
            .catch(err => console.log(err.response.data));
        }
      );

      // success
    })
    .catch(err => {
      if (err.response && err.response.data) {
        if (err.response.data.match(/<!DOCTYPE html>/)) {
          console.log("heroku error");
        } else {
          dispatch({ type: SPINNER_TOGGLE, payload: false });
          dispatch({ type: ERROR_EMIT, payload: err.response.data });
        }
      } else if (err.code === "ECONNABORTED") {
        const lastTime = Date.now();
      } else {
        Object.keys(err).map(key => console.log(key, err[key]));
      }
    });
};
