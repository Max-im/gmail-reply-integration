import moxios from "moxios";
import { ADD_INFO, UPDATE_INFO } from "./constants";
import { onLaunch } from "./integration";
import { getMockStore } from "../../../test/utils";

const store = getMockStore();

describe("Integration actions", () => {
  beforeEach(() => moxios.install());
  afterEach(() => {
    moxios.uninstall();
    store.clearActions();
  });

  /*
   * onLaunch() [success]
   */
  test("onLaunch() [success]", () => {
    const expectedActions = [];
    moxios.stubRequest("/input/id/name", { status: 200, response: "sheet" });

    // TODO write the tests
  });

  /*
   * onLaunch() [error]
   */
  test("onLaunch() [error]", () => {
    const errorMsg = "onLaunch error";
    const expectedActions = [];
    moxios.stubRequest("/input/files", { status: 400, response: errorMsg });
    // TODO write the tests
  });
});
