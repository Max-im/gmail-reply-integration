import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { accountsState } from "../src/store/reducers/accountsReducer";
import { authState } from "../src/store/reducers/authReducer";
import { labelsState } from "../src/store/reducers/labelsReducer";
import { inputState } from "../src/store/reducers/inputReducer";
import { integrationState } from "../src/store/reducers/integrationReducer";

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
export const getMockStore = () => {
  const mockStore = configureStore([thunk]);
  const store = mockStore({
    accounts: { accountsState },
    labels: { ...labelsState },
    auth: { ...authState },
    input: { ...inputState },
    integration: { ...integrationState }
  });

  return store;
};
