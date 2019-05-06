import {
  GET_LABELS,
  LABELS_IN_PROCESS,
  LABELS_ERROR
} from "../actions/constants";
import { labelsState } from "./labelsReducer";
import labels from "./labelsReducer";

describe("labelsReducer", () => {
  /*
   * GET_LABELS
   */
  test("GET_LABELS", () => {
    const arr = [65, 654, 312, 54];
    const expected = { ...labelsState, labels: arr, inProcess: false };

    expect(labels(undefined, { type: GET_LABELS, payload: arr })).toEqual(
      expected
    );
  });

  /*
   * LABELS_IN_PROCESS
   */
  test("LABELS_IN_PROCESS", () => {
    const modified = { ...labelsState, inProcess: false };
    expect(labels(modified, { type: LABELS_IN_PROCESS })).toEqual(labelsState);
  });

  /*
   * LABELS_ERROR
   */
  test("LABELS_ERROR", () => {
    const errorMsg = "errorMsg for labels";
    const expected = { ...labelsState, error: errorMsg };
    expect(
      labels(undefined, { type: LABELS_ERROR, payload: errorMsg })
    ).toEqual(expected);
  });
});
