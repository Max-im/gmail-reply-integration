import {
  ADD_INFO,
  UPDATE_INFO,
  CHANGE_PROGRESS,
  TOGGLE_PROGRESS,
  CONNECT_UPDATE
} from "./constants";
import {
  getLabels,
  getSheetData,
  getDbThreads,
  getAccountsData,
  getAllGmailThreads
} from "./utils/getInputData";
import { output } from "./utils/output";
import { compareWithSheetData, getLabelsMap } from "./utils/compare";
import {
  compareThreadsWithDb,
  removeOldDbThreads,
  createOrUpdate
} from "./utils/update";

export const onLaunch = (fileId, sheetName) => async (dispatch, getState) => {
  if (!fileId || !sheetName) return;
  dispatch({ type: UPDATE_INFO });
  dispatch({ type: ADD_INFO, payload: "Start integration" });
  dispatch({ type: CONNECT_UPDATE });

  try {
    /** ======================================================================
     * getSheetData(fileId, sheetName)
     * @param: fieldId      - id of the file, retrievs from url
     * @param: sheetName    - name of the file sheet, retrievs from url
     * @success             - dispatches sheet data into "connect" store
     * @error               - dispatches error into "display" store
     */
    await dispatch(getSheetData(fileId, sheetName));
    dispatch({ type: ADD_INFO, payload: "Get sheet data" });

    /** ======================================================================
     * getLabels()
     * @success             - dispatches db labels into "connect" store
     * @error               - dispatches error into "display" store
     * @target              - need to construct gmail query
     */
    await dispatch(getLabels());

    /** ======================================================================
     * getAccountsData()
     * @success             - dispatches db accounts data into "accounts" store
     * @error               - dispatches error into "display" store
     */
    if (getState().accounts.inProcess) await dispatch(getAccountsData());

    /** ======================================================================
     * getAllGmailThreads(getState)
     * @success             - dispatch threads into "connect" store;
     * @error               - dont handle errors in this level
     */
    await dispatch(getAllGmailThreads(getState));

    /** ======================================================================
     * getDbThreads()
     * @success             - dispatch threads into "connect" store;
     * @error               - dont handle errors in this level
     */
    await dispatch(getDbThreads());

    /** ======================================================================
     * compareThreadsWithDb()
     * @description compares db threads with new fetched gmail threads retrieves needToCreate, needToUpdate and needToDelete arrs
     * @success dispatches needToCreate, needToUpdate and needToDelete into "connect" store
     */
    dispatch(compareThreadsWithDb());

    /** ======================================================================
     * removeOldDbThreads()
     * @description remove old threads from db if nessesary
     */
    if (getState().connect.needToDelete) await removeOldDbThreads();

    /** ======================================================================
     * createOrUpdate("Create")
     * @description Create new threads if nessesary
     */
    if (getState().connect.needToCreate) {
      // progress dispatching
      dispatch({ type: CHANGE_PROGRESS, payload: 0, meta: "" });
      if (getState().connect[`needToCreate`].length > 20) {
        dispatch({ type: TOGGLE_PROGRESS, payload: true });
      }

      await dispatch(createOrUpdate("Create"));

      dispatch({ type: TOGGLE_PROGRESS, payload: false });
    }

    /** ======================================================================
     * createOrUpdate("Update")
     * @description Update threads if nessesary
     */
    if (getState().connect.needToUpdate) {
      // progress dispatching
      dispatch({ type: CHANGE_PROGRESS, payload: 0, meta: "" });
      if (getState().connect[`needToUpdate`].length > 20) {
        dispatch({ type: TOGGLE_PROGRESS, payload: true });
      }

      await dispatch(createOrUpdate("Update"));

      dispatch({ type: TOGGLE_PROGRESS, payload: false });
    }

    /** ======================================================================
     * getDbThreads()
     * @description Once changes happend, update threads db
     */
    if (
      getState().connect.needToCreate ||
      getState().connect.needToUpdate ||
      getState().connect.needToDelete
    ) {
      await dispatch(getDbThreads());
    }
    dispatch({ type: ADD_INFO, payload: "All threads are updated" });

    dispatch({ type: ADD_INFO, payload: "Retrieve target threads" });

    /** ======================================================================
     *  getLabelsMap()
     * @description fetch labels map for comparring
     */
    await dispatch(getLabelsMap());

    /** ======================================================================
     * compareWithSheetData(sheetData)
     * @description compare db threads with sheet data
     */
    dispatch(compareWithSheetData());

    //
    /** ======================================================================
     * output(fileId, sheetName);
     * @description OUTPUT data row by row
     */

    await dispatch(output(fileId, sheetName, getState));
  } catch (err) {
    if (typeof err === "string") {
      dispatch({ type: ADD_INFO, payload: err, meta: "error" });
    } else {
      console.log("THE ERROR", err);
      dispatch({ type: ADD_INFO, payload: "Error", meta: "error" });
    }
  }
};
