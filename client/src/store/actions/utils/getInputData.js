import axios from "axios";
import { errorHandle } from "./errorHandle";
import {
  ADD_INFO,
  CONNECT_SHEET_DATA,
  CONNECT_GET_LABELS,
  GET_ACCOUNTS,
  CONNECT_GET_GMAIL_THREADS,
  CONNECT_GET_DB_THREADS
} from "../constants";

/** ======================================================================
 * getSheetData()
 * @param: fieldId      - id of the file, retrievs from url
 * @param: sheetName    - name of the file sheet, retrievs from url
 * @success             - dispatches sheet data into "connect" store
 * @error               - dispatches error into "display" store
 * ======================================================================
 */
export const getSheetData = (fileId, sheetName) => dispatch => {
  return axios
    .get(`/input/${fileId}/${sheetName}`)
    .then(res => dispatch({ type: CONNECT_SHEET_DATA, payload: res.data }))
    .catch(err => errorHandle(err, "Getting sheet data error"));
};

/** ======================================================================
 * getLabels()
 * @success             - dispatches db labels into "connect" store
 * @error               - dispatches error into "display" store
 * ======================================================================
 */
export const getLabels = () => dispatch => {
  return axios
    .get("/labels")
    .then(res => dispatch({ type: CONNECT_GET_LABELS, payload: res.data }))
    .catch(err => errorHandle(err, "Getting Labels error"));
};

/** ======================================================================
 * getAccountsData()
 * @success             - dispatches db accounts data into "accounts" store
 * @error               - dispatches error into "display" store
 * ======================================================================
 */
export const getAccountsData = () => dispatch => {
  return axios
    .get("/accounts")
    .then(res => dispatch({ type: GET_ACCOUNTS, payload: res.data }))
    .catch(err => errorHandle(err, "Getting Accounts data error"));
};

/** ======================================================================
 * getAllGmailThreads()
 * @success             - loop each account; Launch threadsLoop();
 * @error               - dont handle errors in this level
 * @target              - get all the threads for all accounts
 */
export const getAllGmailThreads = getState => async dispatch => {
  const { accounts } = getState().accounts;
  const q = constructQuery(getState);

  for (let account of accounts) {
    const options = { userId: "me", maxResults: 500, q };
    const accountData = { accountArr: [], account };
    await dispatch(threadsLoop({ options, accountData }));
  }
};

/** ======================================================================
 * constructQuery()
 * @success             - consrtuct query for gmail request
 * @error               - dont handle errors in this level
 */
const constructQuery = getState => {
  const { dbLabels } = getState().connect;
  const labelNames = dbLabels.map(label => label.name);
  const queryArr = labelNames.map(item => `label:${item}`);
  const query = `{${queryArr.join(" ")}}`;
  return query;
};

/** ======================================================================
 * @name: threadsLoop();
 * @success : dispatches particular account data into "connect" store
 * @Error : dont handle errors in this level
 * @target : launch getThreadBatch() while accountData.isDone !== ture;
 */
const threadsLoop = ({ options, accountData }) => async dispatch => {
  // loop arr
  const arr = [];
  for (var i = 0; i < 50; i++) {
    arr.push(i);
  }
  const { accountArr, account } = accountData;
  const { email, _id: id } = accountData.account;

  // loop
  for (let page of arr) {
    const data = await getThreadBatch(options, id, email);
    const { threads, nextPageToken } = data;

    // save account id to get accoutn credentials for create or update
    if (threads) accountArr.push(...threads.map(i => ({ ...i, uId: id })));
    if (nextPageToken) options.pageToken = nextPageToken;
    else break;
  }

  const msg = `Got ${accountArr.length} threads from - ${account.email}`;
  dispatch({ type: ADD_INFO, payload: msg });
  dispatch({ type: CONNECT_GET_GMAIL_THREADS, payload: accountArr });
};

/** ======================================================================
 * @name: getThreadBatch()
 * @success             - dispatches particular account data into "connect" store
 * @error               - dont handle errors in this level
 */
const getThreadBatch = (options, id, email) => {
  return axios
    .post("/integration/get-all-account-threads", { options, id })
    .then(res => res.data)
    .catch(err => errorHandle(err, `Error getting ${email} thread`));
};

/** ======================================================================
 * getDbThreads()
 * @success - dispatches db threads into "connect" store
 */
export const getDbThreads = () => dispatch => {
  return axios
    .get("/integration/get-db-threads")
    .then(res => dispatch({ type: CONNECT_GET_DB_THREADS, payload: res.data }))
    .catch(err => errorHandle(err, "Error getting db threads"));
};
