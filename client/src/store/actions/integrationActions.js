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
  getAllThreads,
  getDbThreads,
  createDbThreads,
  formatOutput,
  removeOldDbThreads,
  getAccountsLabels,
  compareInputData,
  compareThreadsWithDb,
  updateDbThreads,
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

    dispatch({ type: SELECT_SHEET, payload: sheetName });

    // get sheet data
    var { data: emailArr } = await axios.get(
      `/integration/sheet/${theFile.id}/${sheetName}`
    );
    addInfo("Got sheet Data - " + emailArr.length + " items", dispatch);

    // get all threads
    const threads = await getAllThreads(accounts);
    addInfo("Got " + threads.length + " threads", dispatch);
    console.log(threads.length, "got from gmail");

    // get gb threads
    const dbThreads = await getDbThreads();
    console.log(dbThreads.length, "got from db");

    // filter updated threads
    const compareResult = compareThreadsWithDb(threads, dbThreads);
    const { needToCreate, needToUpdate, needToRemove } = compareResult;
    console.log(needToRemove.length, "need to remove");
    console.log(needToCreate.length, "need to create");
    console.log(needToUpdate.length, "need to update");

    // remove old
    if (needToRemove.length > 0) {
      await removeOldDbThreads(needToRemove);
    }

    // create new
    if (needToCreate.length > 0) {
      addInfo(`Need to create ${needToCreate.length} threads`, dispatch);
      await createDbThreads(needToCreate);
      addInfo("All the new threads were created", dispatch);
    }

    // update db data
    if (needToUpdate.length > 0) {
      addInfo(`Need to update ${needToUpdate.length} threads`, dispatch);
      await updateDbThreads(needToUpdate);
      addInfo("All threads are updated", dispatch);
    }

    // get gb threads
    const idUpdated = needToCreate.length === 0 && needToUpdate.length === 0;
    const actualThreads = idUpdated ? await getDbThreads() : dbThreads;
    addInfo("Start comparing with input data", dispatch);

    // get all labels
    const labels = await getAccountsLabels();

    // compare with input data
    const targetThreads = compareInputData(actualThreads, emailArr, labels);

    // output formated
    const formated = formateIntegrationData(targetThreads);

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
