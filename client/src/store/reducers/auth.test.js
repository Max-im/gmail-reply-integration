import { SET_USER, AUTH_ERROR } from "../actions/constants";
import { authState } from "./authReducer";
import auth from "./authReducer";

describe("Auth reducer", () => {
  /*
   * SET_USER with data
   */
  test("SET_USER with data", () => {
    const userData = { name: "user", email: "email" };
    const expectedResult = { ...authState, user: userData, isAuth: true };

    expect(auth(undefined, { type: SET_USER, payload: userData })).toEqual(
      expectedResult
    );
  });

  /*
   * SET_USER empty
   */
  test("SET_USER empty", () => {
    const userData = {};
    const modified = { ...authState, user: { name: "name" }, isAuth: true };
    const expectedResult = { ...authState, user: userData, isAuth: false };

    expect(auth(modified, { type: SET_USER, payload: userData })).toEqual(
      expectedResult
    );
  });

  /*
   * AUTH_ERROR empty
   */
  test("AUTH_ERROR", () => {
    const errorMsg = "Error msg";
    const expectedResult = { ...authState, error: errorMsg };
    expect(auth(undefined, { type: AUTH_ERROR, payload: errorMsg })).toEqual(
      expectedResult
    );
  });
});
