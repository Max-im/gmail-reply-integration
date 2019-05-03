import moxios from "moxios";
import { LABELS_IN_PROCESS, GET_LABELS, LABELS_ERROR } from "./constants";
import { getLabels, toggleCheck } from "./labels";
import { getMockStore } from "../../../test/utils";

const store = getMockStore();

describe("labels actions", () => {
  beforeEach(() => moxios.install());
  afterEach(() => {
    moxios.uninstall();
    store.clearActions();
  });

  /*
   * getLabels() [success]
   */
  test("getLabels() [success]", () => {
    const payload = ["label1", "label2", "label3"];
    const expectedActions = [
      { type: GET_LABELS, payload },
      { type: LABELS_ERROR, payload: null }
    ];
    moxios.stubRequest("/labels", { status: 200, response: payload });

    return store.dispatch(getLabels()).then(() => {
      expect(expectedActions).toEqual(store.getActions());
    });
  });

  /*
   * getLabels() [error]
   */
  test("getLabels() [error]", () => {
    const errorMsg = "errorMsg getting labels";
    const expectedActions = [{ type: LABELS_ERROR, payload: errorMsg }];
    moxios.stubRequest("/labels", { status: 400, response: errorMsg });

    return store.dispatch(getLabels()).then(() => {
      expect(expectedActions).toEqual(store.getActions());
    });
  });

  /*
   * toggleCheck() [success]
   */
  test("toggleCheck() [success]", () => {
    const expectedActions = [
      { type: LABELS_IN_PROCESS },
      { type: LABELS_ERROR, payload: null }
    ];
    moxios.stubRequest("/labels/id", { status: 200 });

    return store.dispatch(toggleCheck("id")).then(() => {
      expect(expectedActions).toEqual(store.getActions());
    });
  });

  /*
   * toggleCheck() [error]
   */
  test("toggleCheck() [error]", () => {
    const errorMsg = "errorMsg toggeling label";
    const expectedActions = [
      { type: LABELS_IN_PROCESS },
      { type: LABELS_ERROR, payload: errorMsg }
    ];
    moxios.stubRequest("/labels/id", { status: 400, response: errorMsg });

    return store.dispatch(toggleCheck("id")).then(() => {
      expect(expectedActions).toEqual(store.getActions());
    });
  });
});
