import rootReducer from "./";
import { authState } from "./authReducer";
import { inputState } from "./inputReducer";
import { accountsState } from "./accountsReducer";
import { labelsState } from "./labelsReducer";
import { integrationState } from "./integrationReducer";

describe("root reducer", () => {
  test("init root reducer", () => {
    expect(rootReducer({}, {})).toEqual({
      auth: authState,
      labels: labelsState,
      accounts: accountsState,
      input: inputState,
      integration: integrationState
    });
  });
});
