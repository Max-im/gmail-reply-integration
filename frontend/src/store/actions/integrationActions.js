import axios from "axios";

import {
  GET_FILES,
  START_PROCESS,
  END_PROCESS,
  GET_SHEETS,
  SELECT_FILE,
  SELECT_SHEET,
  CHANGE_STAGE,
  SUCCESS_EMIT
} from "./constants";

import {
  formateIntegrationData,
  updateAccounts,
  compareResults,
  outputData
} from "./utils/integration";
import { getAccounts } from "./settingsActions";
import { addInfo, addError } from "./utils/general";

// get names of the files
export const uploadFileNames = () => async dispatch => {
  try {
    dispatch({ type: START_PROCESS });
    const { data: files } = await axios.get("/integration/files");
    dispatch({ type: GET_FILES, payload: files });
    dispatch({ type: END_PROCESS });
  } catch (err) {
    addError(err, dispatch);
  }
};

// get sheet names
export const onGetSheets = file => async dispatch => {
  try {
    dispatch({ type: START_PROCESS });
    dispatch({ type: CHANGE_STAGE, payload: 2 });
    dispatch({ type: SELECT_FILE, payload: file });
    const { data: sheets } = await axios.get(`/integration/file/${file.id}`);
    dispatch({ type: GET_SHEETS, payload: sheets });
    dispatch({ type: END_PROCESS });
  } catch (err) {
    addError(err, dispatch);
  }
};

// integration launch
export const onLaunch = sheetName => async (dispatch, getState) => {
  try {
    dispatch({ type: SUCCESS_EMIT, payload: false });
    dispatch({ type: START_PROCESS });

    const state = getState();
    const { theFile } = state.integration;
    const { accounts } = state.settings;

    // check if all the accounts are uploaded
    if (accounts.some(item => !item.isUploaded)) {
      return addError("You must upload Accounts first", dispatch);
    }

    dispatch({ type: SELECT_SHEET, payload: sheetName });

    // get sheet data
    const { data: emailArr } = await axios.get(
      `/integration/sheet/${theFile.id}/${sheetName}`
    );
    addInfo("Got sheet Data", dispatch);

    // update accounts data by historyId
    await updateAccounts(accounts);
    addInfo("Accounts data updated", dispatch);
    dispatch(getAccounts(false));

    // compare emails
    const compared = await compareResults(emailArr);
    addInfo("Threads are found", dispatch);

    // formated
    const formated = formateIntegrationData(compared);
    addInfo("Data formatted", dispatch);

    // output
    await outputData(formated, theFile.id, sheetName);

    // show success
    dispatch({ type: SUCCESS_EMIT, payload: "Integration complete" });
  } catch (err) {
    addError(err, dispatch);
  }
  dispatch({ type: END_PROCESS });
};

// cancel btn click
export const onIntegrationCancel = () => dispatch => {
  try {
    dispatch({ type: CHANGE_STAGE, payload: 1 });
    dispatch({ type: SELECT_FILE, payload: false });
  } catch (err) {
    addError(err, dispatch);
  }
};
