import {
  GET_ACCOUNTS,
  ACCOUNTS_IN_PROCESS,
  ACCOUNTS_ERROR
} from "../actions/constants";

import { accountsState } from "./accountsReducer";
import accounts from "./accountsReducer";

describe("Accounts reducer", () => {
  /*
   * GET_ACCOUNTS
   */
  test("GET_ACCOUNTS", () => {
    const getAcc = [1, 2, 3];
    const expectedResult = {
      ...accountsState,
      accounts: getAcc,
      inProcess: false
    };

    expect(
      accounts(undefined, { type: GET_ACCOUNTS, payload: getAcc })
    ).toEqual(expectedResult);
  });

  /*
   * ACCOUNTS_ERROR
   */
  test("ACCOUNTS_ERROR", () => {
    const errorMsg = "Error message";
    const expectedResult = { ...accountsState, error: errorMsg };

    expect(
      accounts(undefined, { type: ACCOUNTS_ERROR, payload: errorMsg })
    ).toEqual(expectedResult);
  });

  /*
   * ACCOUNTS_IN_PROCESS
   */
  test("ACCOUNTS_IN_PROCESS", () => {
    const modified = { ...accountsState, inProcess: false };
    const expectedResult = { ...modified, inProcess: true };
    expect(accounts(modified, { type: ACCOUNTS_IN_PROCESS })).toEqual(
      expectedResult
    );
  });
});
