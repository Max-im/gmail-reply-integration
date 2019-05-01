import moxios from "moxios";
import { ACCOUNTS_ERROR, GET_ACCOUNTS, ACCOUNTS_IN_PROCESS } from "./constants";
import { getAccounts, removeAccount, createAccount } from "./accounts";
import { getMockStore } from "../../../test/utils";

const store = getMockStore();

describe("accounts actions", () => {
  beforeEach(() => moxios.install());
  afterEach(() => {
    moxios.uninstall();
    store.clearActions();
  });

  /*
   * getAccounts() [success]
   */
  test("getAccounts() [success]", () => {
    const payload = [
      { _id: 1, email: "first@gmail.com", picture: "picture", name: "first" },
      { _id: 2, email: "second@gmail.com", picture: "picture", name: "second" }
    ];
    const actions = [
      { type: GET_ACCOUNTS, payload },
      { type: ACCOUNTS_ERROR, payload: null }
    ];
    moxios.stubRequest("/accounts", { status: 200, response: payload });

    return store.dispatch(getAccounts()).then(() => {
      expect(actions).toEqual(store.getActions());
    });
  });

  /*
   * getAccounts() [error]
   */
  test("getAccounts() [error]", () => {
    const payload = "error Message";
    const actions = [
      { type: ACCOUNTS_ERROR, payload: null },
      { type: ACCOUNTS_ERROR, payload }
    ];
    moxios.stubRequest("/accounts", { status: 400, response: payload });

    return store.dispatch(getAccounts()).catch(() => {
      expect(actions).toEqual(store.getActions());
    });
  });

  /*
   * removeAccount() [success]
   */
  test("removeAccount() [success]", () => {
    const expectedActions = [
      { type: ACCOUNTS_IN_PROCESS },
      { type: ACCOUNTS_ERROR, payload: null }
    ];
    moxios.stubRequest(`/accounts/id`, { status: 200 });

    return store.dispatch(removeAccount("id")).then(() => {
      expect(expectedActions).toEqual(store.getActions());
    });
  });

  /*
   * removeAccount() [error]
   */
  test("removeAccount() [error]", () => {
    const expectedActions = [
      { type: ACCOUNTS_IN_PROCESS },
      { type: ACCOUNTS_ERROR, payload: null },
      { type: ACCOUNTS_ERROR, payload: "error" }
    ];
    moxios.stubRequest(`/accounts/id`, { status: 400, response: "error" });

    return store.dispatch(removeAccount("id")).then(() => {
      expect(expectedActions).toEqual(store.getActions());
    });
  });

  /*
   * createAccount() [success]
   */
  test("createAccount() [success]", () => {
    // const expectedActions = [
    //   { type: ACCOUNTS_IN_PROCESS },
    //   { type: ACCOUNTS_ERROR, payload: null },
    //   { type: ACCOUNTS_ERROR, payload: "error" }
    // ];
    // moxios.stubRequest(`/accounts`, { status: 200, response: "data" });
    // return store.dispatch(createAccount({ code: "code" })).then(() => {
    //   console.log(store.getActions())
    // });
  });
});
