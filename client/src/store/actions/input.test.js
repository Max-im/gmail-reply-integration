import moxios from "moxios";
import {
  GET_SHEETS,
  GET_FILES,
  SHEET_ERROR,
  FILES_ERROR,
  UPDATE_SHEETS
} from "./constants";
import { getFiles, getSheets } from "./input";
import { getMockStore } from "../../../test/utils";

const store = getMockStore();

describe("Input actions", () => {
  beforeEach(() => moxios.install());
  afterEach(() => {
    moxios.uninstall();
    store.clearActions();
  });

  /*
   * getFiles() [success]
   */
  test("getFiles() [success]", () => {
    const payload = "files data";
    const expectedActions = [
      { type: FILES_ERROR, payload: null },
      { type: GET_FILES, payload }
    ];
    moxios.stubRequest("/input/files", { status: 200, response: payload });

    return store.dispatch(getFiles()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  /*
   * getFiles() [error]
   */
  test("getFiles() [error]", () => {
    const errorMsg = "error getting files";
    const expectedActions = [
      { type: FILES_ERROR, payload: null },
      { type: FILES_ERROR, payload: errorMsg }
    ];
    moxios.stubRequest("/input/files", { status: 400, response: errorMsg });

    return store.dispatch(getFiles()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  /*
   * getSheets() [success]
   */
  test("getSheets() [success]", () => {
    const payload = "sheets data";
    const expectedActions = [
      { type: SHEET_ERROR, payload: null },
      { type: UPDATE_SHEETS },
      { type: GET_SHEETS, payload }
    ];
    moxios.stubRequest("/input/file/id", { status: 200, response: payload });

    return store.dispatch(getSheets("id")).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  /*
   * getSheets() [error]
   */
  test("getSheets() [error]", () => {
    const errorMsg = "sheets error";
    const expectedActions = [
      { type: SHEET_ERROR, payload: null },
      { type: UPDATE_SHEETS },
      { type: SHEET_ERROR, payload: errorMsg }
    ];
    moxios.stubRequest("/input/file/id", { status: 400, response: errorMsg });

    return store.dispatch(getSheets("id")).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
