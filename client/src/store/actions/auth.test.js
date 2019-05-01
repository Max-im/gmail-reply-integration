import moxios from "moxios";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { SET_USER, AUTH_ERROR } from "./constants";
import { onLogin, onLogout } from "./auth";
import { getMockStore } from "../../../test/utils";

const store = getMockStore();
const userToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExMDgyMjA2MDg3NjQ2ODExNDg1OCIsImVtYWlsIjoibWF4aW0ucG9naWRhZXZAaWRlYWxzY29ycC5jb20iLCJuYW1lIjoiTWF4aW0gUG9naWRhZXYiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDYuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy01UWhDU2JkVDRhZy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFFUS9WVjY4ZnhNeU1zNC9waG90by5qcGciLCJpYXQiOjE1NTYwMjQxMzZ9.vWPVIIffcxPgE6LC3j3gD3A8nKVQEN6hgjQvpSctZWo";

//localStorage.setItem("outBandSales", token);
describe("Auth actions", () => {
  beforeEach(() => moxios.install());
  afterEach(() => {
    moxios.uninstall();
    store.clearActions();
  });

  /*
   * Login [success]
   */
  test("Login [success]", () => {
    const payload = jwt_decode(userToken);
    const expectedActions = [
      { type: AUTH_ERROR, payload: null },
      { type: SET_USER, payload }
    ];

    moxios.stubRequest("/auth/login", { status: 200, response: userToken });

    return store.dispatch(onLogin({ code: "code" })).then(() => {
      expect(expectedActions).toEqual(store.getActions());
      expect(axios.defaults.headers.common["Authorization"]).toBe(userToken);
    });
  });

  /*
   * Login [error code]
   */
  test("Login [error code]", () => {
    const expectedActions = [{ type: AUTH_ERROR, payload: "Invalid code" }];

    moxios.stubRequest("/auth/login", { status: 400 });

    return store.dispatch(onLogin()).then(() => {
      expect(expectedActions).toEqual(store.getActions());
    });
  });

  /*
   * Login [error]
   */
  test("Login [error]", () => {
    const errorMsg = "error message";
    const expectedActions = [
      { type: AUTH_ERROR, payload: null },
      { type: AUTH_ERROR, payload: errorMsg }
    ];

    moxios.stubRequest("/auth/login", { status: 400, response: errorMsg });

    return store.dispatch(onLogin({ code: "code" })).then(() => {
      expect(expectedActions).toEqual(store.getActions());
    });
  });
});
