import { CLOSE_ERROR, SUCCESS_EMIT } from "./constants";

export const closeError = index => dispatch => {
  dispatch({ type: CLOSE_ERROR, payload: index });
};

export const closeSuccess = () => dispatch => {
  dispatch({ type: SUCCESS_EMIT, payload: false });
};
