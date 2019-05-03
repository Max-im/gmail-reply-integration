import {
  ADD_INFO,
  UPDATE_INFO,
  TOGGLE_PROGRESS,
  CHANGE_PROGRESS
} from "../actions/constants";
import { displayState } from "./displayReducer";
import display from "./displayReducer";

describe("displayReducer", () => {
  /*
   * ADD_INFO [error]
   */
  test("ADD_INFO [error]", () => {
    const newInfo = "new info";
    const actions = [1, 2, 3];
    const modified = { ...displayState, actions };
    const expected = {
      ...displayState,
      actions: [...actions, { text: newInfo, type: "error" }]
    };

    expect(
      display(modified, { type: ADD_INFO, payload: newInfo, meta: "error" })
    ).toEqual(expected);
  });

  /*
   * ADD_INFO [info]
   */
  test("ADD_INFO [info]", () => {
    const newInfo = "new info";
    const actions = [1, 2, 3];
    const modified = { ...displayState, actions };
    const expected = {
      ...displayState,
      actions: [...actions, { text: newInfo, type: "info" }]
    };

    expect(display(modified, { type: ADD_INFO, payload: newInfo })).toEqual(
      expected
    );
  });

  /*
   * UPDATE_INFO
   */
  test("UPDATE_INFO", () => {
    const modified = { ...displayState, actions: [5, 4, 6, 7] };
    expect(display(modified, { type: UPDATE_INFO })).toEqual(displayState);
  });

  /*
   * TOGGLE_PROGRESS [true]
   */
  test("TOGGLE_PROGRESS [true]", () => {
    const expected = { ...displayState, showProgress: true };
    expect(
      display(undefined, { type: TOGGLE_PROGRESS, payload: true })
    ).toEqual(expected);
  });

  /*
   * TOGGLE_PROGRESS [false]
   */
  test("TOGGLE_PROGRESS [false]", () => {
    const modified = { ...displayState, showProgress: true };
    expect(
      display(modified, { type: TOGGLE_PROGRESS, payload: false })
    ).toEqual(displayState);
  });

  /*
   * CHANGE_PROGRESS
   */
  test("CHANGE_PROGRESS", () => {
    const newNum = 81;
    const newTitle = "newTitle";
    const expected = {
      ...displayState,
      progress: newNum,
      progressTitle: newTitle
    };
    expect(
      display(undefined, {
        type: CHANGE_PROGRESS,
        payload: newNum,
        meta: newTitle
      })
    ).toEqual(expected);
  });
});
