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
// !!! important
// email loop is not in backend becaouse request is too long, and axios emit an timeout error
export const integrationLaunch = sheetData => dispatch => {
  const { fromDb } = sheetData;

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
      const { emailArr, tabLen, dbEmails } = res.data;
      const dbEmailsArr = dbEmails.map(item => item.email);
      const result = [];
      asyncLoop(
        emailArr,
        (email, nextEmail) => {
          // return data from db

          if (fromDb && dbEmailsArr.includes(email)) {
            const dbResult = dbEmails
              .filter(item => item.email === email)
              .map(item => ({ email, labels: item.labels, body: item.body }));

            result.push(dbResult[0]);
            dispatch({
              type: UPDATE_PROGRESS_BAR,
              payload: {
                status: `Checked ${result.length} from ${
                  emailArr.length
                } emails.`,
                progress: result.length / emailArr.length
              }
            });
            setTimeout(() => nextEmail(), 3);
          }
          // return data from gmail
          else {
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
          }
        },
        () => {
          dispatch({
            type: UPDATE_PROGRESS_BAR,
            payload: {
              status: "Pasting data to SpreadSheet",
              progress: 1
            }
          });
          // output data
          axios
            .post("/integration/output-data", { result, tabLen, ...sheetData })
            .then(res => {
              dispatch({ type: SPINNER_TOGGLE, payload: false });
              dispatch({
                type: SUCCESS_EMIT,
                payload: "Integration done success!"
              });
            })
            .catch(err => {
              dispatch({ type: SPINNER_TOGGLE, payload: false });
              dispatch({ type: ERROR_EMIT, payload: err.response.data.msg });
            });
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
        console.log("ECONNABORTED error");
      } else {
        Object.keys(err).map(key => console.log(key, err[key]));
      }
    });
};
