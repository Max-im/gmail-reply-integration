import { shallow } from "enzyme";
import { createStore } from "redux";
import rootReducer from "../src/store/reducers";

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
 * Search element by data-test attribute
 */
export const searchEl = (component, attr) => {
  return component.find(`[data-test="${attr}"]`);
};

export const renderComponent = (component, attr) => {
  const wrapper = shallow(component);
  const el = wrapper.find(`[data-test="${attr}"]`);
  expect(el.length).toBe(1);
};

export const storeFactory = initState => {
  const defaultState = {
    auth: {},
    labels: {},
    accounts: {},
    input: {},
    integration: {}
  };
  return createStore(rootReducer, { ...defaultState, ...initState });
};
