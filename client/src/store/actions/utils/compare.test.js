import moxios from "moxios";
import { CONNECT_GET_LABEL_MAP, CONNECT_GET_COMPRED } from "../constants";
import { compareWithSheetData, getLabelsMap } from "./compare";
import { getMockStore } from "../../../../test/utils";

const store = getMockStore();

describe("utils/compare actions", () => {
  beforeEach(() => moxios.install());
  afterEach(() => {
    moxios.uninstall();
    store.clearActions();
  });

  /**
   * @name getLabelsMap [success]
   */
  test("getLabelsMap() [success]", () => {
    const payload = [{ name: "label1" }, { name: "label2" }];
    const expectedActions = [{ type: CONNECT_GET_LABEL_MAP, payload }];
    moxios.stubRequest("/labels/target-labels-map", {
      status: 200,
      response: payload
    });

    return store.dispatch(getLabelsMap()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  /**
   * @name getLabelsMap [error]
   */
  test("getLabelsMap() [error]", () => {
    const errMsg = "Error from getLabelsMap";
    moxios.stubRequest("/labels/target-labels-map", {
      status: 400,
      response: errMsg
    });

    return store.dispatch(getLabelsMap()).catch(err => {
      expect(err).toBe(errMsg);
    });
  });

  /**
   * @name compareWithSheetData [success]
   */
  test("compareWithSheetData() [success]", () => {
    // TODO
  });
});
