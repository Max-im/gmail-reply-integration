import { ADD_INFO, UPDATE_INFO } from "./constants";
import { getDbThreads } from "./utils/integration";
import { getInputData } from "./utils/getInputData";
import { output } from "./utils/output";
import { compare } from "./utils/compare";
import { update } from "./utils/update";

export const onLaunch = (fileId, sheetName) => async dispatch => {
  try {
    dispatch({ type: ADD_INFO, payload: "Start integration" });
    dispatch({ type: UPDATE_INFO });

    // GET INPUT
    const inputData = await getInputData(fileId, sheetName, dispatch);
    const { sheetData, threads } = inputData;

    // get gb threads
    const dbThreads = await getDbThreads(dispatch);

    // UPDATE DB DATA
    const actualThreads = await update(threads, dbThreads, dispatch);

    // COMPARE
    dispatch({ type: ADD_INFO, payload: "Retrieve target threads" });
    const targetThreads = await compare(actualThreads, sheetData);

    // OUTPUT
    dispatch({ type: ADD_INFO, payload: "Output data" });
    await output(targetThreads, fileId, sheetName);
    dispatch({ type: ADD_INFO, payload: "Success" });
  } catch (err) {
    if (err && err.response && err.response.data) {
      return dispatch({
        type: ADD_INFO,
        payload: err.response.data,
        meta: "error"
      });
    }
    console.log(err);
  }
};
