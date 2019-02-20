import axios from "axios";

import {
  GET_FILES,
  ERROR_EMIT,
  START_PROCESS,
  END_PROCESS,
  GET_SHEETS,
  SELECT_FILE,
  SELECT_SHEET,
  CHANGE_STAGE,
  SUCCESS_EMIT
} from "./constants";

import { formateIntegrationData } from "./utils/integration";
import { addInfo } from "./utils/general";

// get names of the files
export const uploadFileNames = () => async dispatch => {
  dispatch({ type: START_PROCESS });
  try {
    const { data: files } = await axios.get("/integration/files");
    dispatch({ type: GET_FILES, payload: files });
  } catch (err) {
    dispatch({ type: ERROR_EMIT, payload: err });
  }
  dispatch({ type: END_PROCESS });
};

// get sheet names
export const onGetSheets = file => async dispatch => {
  dispatch({ type: START_PROCESS });
  dispatch({ type: CHANGE_STAGE, payload: 2 });
  dispatch({ type: SELECT_FILE, payload: file });
  try {
    const { data: sheets } = await axios.get(`/integration/file/${file.id}`);
    dispatch({ type: GET_SHEETS, payload: sheets });
  } catch (err) {
    dispatch({ type: ERROR_EMIT, payload: err });
  }
  dispatch({ type: END_PROCESS });
};

// integration launch
export const onLaunch = sheetName => async (dispatch, getState) => {
  dispatch({ type: START_PROCESS });
  dispatch({ type: SUCCESS_EMIT, payload: false });
  const state = getState();
  const { theFile } = state.integration;
  const { accounts } = state.settings;

  // check if all the accounts are uploaded
  if (accounts.some(item => !item.isUploaded)) {
    dispatch({ type: END_PROCESS });
    return dispatch({
      type: ERROR_EMIT,
      payload: "You must upload Accounts first"
    });
  }

  dispatch({ type: SELECT_SHEET, payload: sheetName });

  try {
    // get sheet data
    const { data: emailArr } = await axios.get(
      `/integration/sheet/${theFile.id}/${sheetName}`
    );

    addInfo("Got sheet Data", dispatch);

    // update accounts data by historyId
    await axios.get("/integration/update");
    addInfo("Accounts data updated", dispatch);

    // compare emails
    const { data: result } = await axios.post("/integration/compare", {
      emailArr
    });
    addInfo("Threads are found", dispatch);

    // formated
    const formated = formateIntegrationData(result);
    addInfo("Data formated", dispatch);

    // output
    await axios.post("/integration/sheet", {
      fileId: theFile.id,
      sheetName,
      data: formated
    });

    // show success
    dispatch({ type: SUCCESS_EMIT, payload: "Integration complete" });
  } catch (err) {
    console.log(err);
    dispatch({ type: ERROR_EMIT, payload: err.response.data });
  }
  dispatch({ type: END_PROCESS });
};

// cancel btn click
export const onIntegrationCancel = () => dispatch => {
  dispatch({ type: CHANGE_STAGE, payload: 1 });
  dispatch({ type: SELECT_FILE, payload: false });
};
