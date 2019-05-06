import rootReducer from "./";
import { authState } from "./authReducer";
import { inputState } from "./inputReducer";
import { accountsState } from "./accountsReducer";
import { labelsState } from "./labelsReducer";
import { connectState } from "./connectReducer";
import { displayState } from "./displayReducer";

describe("root reducer", () => {
  test("init root reducer", () => {
    expect(rootReducer({}, {})).toEqual({
      auth: authState,
      labels: labelsState,
      accounts: accountsState,
      input: inputState,
      connect: connectState,
      display: displayState
    });
  });
});
