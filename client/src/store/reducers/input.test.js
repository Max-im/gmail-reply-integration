import {
  GET_FILES,
  GET_SHEETS,
  SHEET_ERROR,
  FILES_ERROR,
  UPDATE_SHEETS
} from "../actions/constants";
import { inputState } from "./inputReducer";
import input from "./inputReducer";

describe("input Reducer", () => {
  /*
   * GET_FILES
   */
  test("GET_FILES", () => {
    const arr = [1, 3, 6, 8];
    const expectedResult = { ...inputState, files: arr, filesReady: true };

    expect(input(undefined, { type: GET_FILES, payload: arr })).toEqual(
      expectedResult
    );
  });

  /*
   * GET_SHEETS
   */
  test("GET_SHEETS", () => {
    const arr = [1, 3, 6, 8];
    const expectedResult = { ...inputState, sheets: arr, sheetsReady: true };

    expect(input(undefined, { type: GET_SHEETS, payload: arr })).toEqual(
      expectedResult
    );
  });

  /*
   * UPDATE_SHEETS
   */
  test("UPDATE_SHEETS", () => {
    const modified = { ...inputState, sheets: [1, 2, 3], sheetsReady: true };
    expect(input(modified, { type: UPDATE_SHEETS })).toEqual(inputState);
  });

  /*
   * FILES_ERROR
   */
  test("FILES_ERROR", () => {
    const errorMsg = "error files";
    const expectedResult = { ...inputState, filesError: errorMsg };
    expect(input(undefined, { type: FILES_ERROR, payload: errorMsg })).toEqual(
      expectedResult
    );
  });

  /*
   * SHEET_ERROR
   */
  test("SHEET_ERROR", () => {
    const errorMsg = "error sheets";
    const expectedResult = { ...inputState, sheetError: errorMsg };
    expect(input(undefined, { type: SHEET_ERROR, payload: errorMsg })).toEqual(
      expectedResult
    );
  });
});
