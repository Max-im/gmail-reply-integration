import {
  ADD_INFO,
  UPDATE_INFO,
  TOGGLE_PROGRESS,
  CHANGE_PROGRESS
} from "../actions/constants";
import { integrationState } from "./integrationReducer";
import integration from "./integrationReducer";

describe("integrationReducer", () => {
  /*
   * ADD_INFO [error]
   */
  test("ADD_INFO [error]", () => {
    const newInfo = "new info";
    const actions = [1, 2, 3];
    const modified = { ...integrationState, actions };
    const expected = {
      ...integrationState,
      actions: [...actions, { text: newInfo, type: "error" }]
    };

    expect(
      integration(modified, { type: ADD_INFO, payload: newInfo, meta: "error" })
    ).toEqual(expected);
  });

  /*
   * ADD_INFO [info]
   */
  test("ADD_INFO [info]", () => {
    const newInfo = "new info";
    const actions = [1, 2, 3];
    const modified = { ...integrationState, actions };
    const expected = {
      ...integrationState,
      actions: [...actions, { text: newInfo, type: "info" }]
    };

    expect(integration(modified, { type: ADD_INFO, payload: newInfo })).toEqual(
      expected
    );
  });

  /*
   * UPDATE_INFO
   */
  test("UPDATE_INFO", () => {
    const modified = { ...integrationState, actions: [5, 4, 6, 7] };
    expect(integration(modified, { type: UPDATE_INFO })).toEqual(
      integrationState
    );
  });

  /*
   * TOGGLE_PROGRESS [true]
   */
  test("TOGGLE_PROGRESS [true]", () => {
    const expected = { ...integrationState, showProgress: true };
    expect(
      integration(undefined, { type: TOGGLE_PROGRESS, payload: true })
    ).toEqual(expected);
  });

  /*
   * TOGGLE_PROGRESS [false]
   */
  test("TOGGLE_PROGRESS [false]", () => {
    const modified = { ...integrationState, showProgress: true };
    expect(
      integration(modified, { type: TOGGLE_PROGRESS, payload: false })
    ).toEqual(integrationState);
  });

  /*
   * CHANGE_PROGRESS
   */
  test("CHANGE_PROGRESS", () => {
    const newNum = 81;
    const newTitle = "newTitle";
    const expected = {
      ...integrationState,
      progress: newNum,
      progressTitle: newTitle
    };
    expect(
      integration(undefined, {
        type: CHANGE_PROGRESS,
        payload: newNum,
        meta: newTitle
      })
    ).toEqual(expected);
  });
});
