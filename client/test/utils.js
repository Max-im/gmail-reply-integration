import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import { authState } from "../src/store/reducers/authReducer";
import { connectState } from "../src/store/reducers/connectReducer";
import { displayState } from "../src/store/reducers/displayReducer";
import { inputState } from "../src/store/reducers/inputReducer";
import { labelsState } from "../src/store/reducers/labelsReducer";
import { accountsState } from "../src/store/reducers/accountsReducer";

/*
 * Check if the element was rendered properly
 */
export const isRender = (component, attr) => {
  expect(component.find(`[data-test="${attr}"]`).exists()).toBe(true);
};

/*
 * Check if the element was rendered properly
 */
export const isNotRender = (component, attr) => {
  expect(component.find(`[data-test="${attr}"]`).exists()).toBe(false);
};

/*
 * configure mock store for testing
 */
export const getMockStore = (initProps = {}) => {
  const mockStore = configureStore([thunk]);
  const store = mockStore({
    auth: authState,
    connect: connectState,
    display: displayState,
    input: inputState,
    labels: labelsState,
    accounts: accountsState,
    ...initProps
  });

  return store;
};
