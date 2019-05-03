import moxios from "moxios";
import {
  ADD_INFO,
  CONNECT_SHEET_DATA,
  CONNECT_GET_LABELS,
  GET_ACCOUNTS,
  CONNECT_GET_GMAIL_THREADS,
  CONNECT_GET_DB_THREADS
} from "../constants";
import {
  getSheetData,
  getLabels,
  getAccountsData,
  getAllGmailThreads,
  getDbThreads
} from "./getInputData";
import { getMockStore } from "../../../../test/utils";

const store = getMockStore();

describe("utils/getInputData", () => {
  beforeEach(() => moxios.install());
  afterEach(() => {
    moxios.uninstall();
    store.clearActions();
  });

  /**
   * getSheetData() [success]
   */
  test("getSheetData() [success]", () => {
    const payload = ["sheetData1", "sheetData2"];
    const expectedActions = [{ type: CONNECT_SHEET_DATA, payload }];
    moxios.stubRequest("/input/fileId/sheetName", {
      status: 200,
      response: payload
    });

    return store.dispatch(getSheetData("fileId", "sheetName")).then(() => {
      expect(expectedActions).toEqual(store.getActions());
    });
  });

  /**
   * getSheetData() [error]
   */
  test("getSheetData [error]", () => {
    const errMsg = "sheet error msg";
    moxios.stubRequest("/input/fileId/sheetName", {
      status: 400,
      response: errMsg
    });

    return store.dispatch(getSheetData("fileId", "sheetName")).catch(err => {
      expect(err).toEqual(errMsg);
    });
  });

  /**
   * getLabels() [success]
   */
  test("getLabels() [success]", () => {
    const payload = ["label1", "label2"];
    const expectedActions = [{ type: CONNECT_GET_LABELS, payload }];
    moxios.stubRequest("/labels", { status: 200, response: payload });

    return store.dispatch(getLabels()).then(() => {
      expect(expectedActions).toEqual(store.getActions());
    });
  });

  /**
   * getLabels() [error]
   */
  test("getLabels [error]", () => {
    const errMsg = "labels error msg";
    moxios.stubRequest("/labels", { status: 400, response: errMsg });

    return store.dispatch(getLabels()).catch(err => {
      expect(err).toEqual(errMsg);
    });
  });

  /**
   * getAccountsData() [success]
   */
  test("getAccountsData() [success]", () => {
    const payload = ["accountData1", "accountData2"];
    const expectedActions = [{ type: GET_ACCOUNTS, payload }];
    moxios.stubRequest("/accounts", { status: 200, response: payload });

    return store.dispatch(getAccountsData()).then(() => {
      expect(expectedActions).toEqual(store.getActions());
    });
  });

  /**
   * getAccountsData() [error]
   */
  test("getAccountsData [error]", () => {
    const errMsg = "accounts error msg";
    moxios.stubRequest("/accounts", { status: 400, response: errMsg });

    return store.dispatch(getAccountsData()).catch(err => {
      expect(err).toEqual(errMsg);
    });
  });

  /**
   * getAllGmailThreads() [success]
   * @inclued constructQuery()
   * @inclued threadsLoop()
   * @included getThreadBatch()
   */
  describe("getAllGmailThreads()", () => {
    const accounts = [{ _id: 1, email: "mail1" }, { _id: 2, email: "mail2" }];
    const threads = [{ id: "threadData1" }, { id: "threadData2" }];

    const store = getMockStore({
      connect: { dbLabels: [{ name: "label1" }, { name: "label2" }] },
      accounts: { accounts }
    });

    /**
     * [success]
     */
    test("[success]", () => {
      const expectedActions = [];
      accounts.map(acc => {
        expectedActions.push({
          type: ADD_INFO,
          payload: `Got ${threads.length} threads from - ${acc.email}`
        });
        expectedActions.push({
          type: CONNECT_GET_GMAIL_THREADS,
          payload: threads.map(item => ({ ...item, uId: acc._id }))
        });
      });

      moxios.stubRequest("/integration/get-all-account-threads", {
        status: 200,
        response: { threads }
      });

      return store.dispatch(getAllGmailThreads(store.getState)).then(() => {
        expect(expectedActions).toEqual(store.getActions());
      });
    });

    /**
     * [error]
     */
    test("[error]", () => {
      const errMsg = `blbjllbaj`;
      moxios.stubRequest("/integration/get-all-account-threads", {
        status: 400,
        response: errMsg
      });

      return store
        .dispatch(getAllGmailThreads(store.getState))
        .catch(err => expect(err).toEqual(errMsg));
    });
  });
});
