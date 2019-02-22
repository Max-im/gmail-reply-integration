import { CLOSE_ERROR, SUCCESS_EMIT } from "./constants";

export const closeError = id => dispatch => {
  dispatch({ type: CLOSE_ERROR, payload: id });
};

export const closeSuccess = () => dispatch => {
  dispatch({ type: SUCCESS_EMIT, payload: false });
};
