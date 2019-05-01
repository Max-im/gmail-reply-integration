import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

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
  const store = mockStore({});

  return store;
};
