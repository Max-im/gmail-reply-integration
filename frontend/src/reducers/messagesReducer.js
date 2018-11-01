import { ERROR_EMIT, SUCCESS_EMIT } from "../actions/constants";

const initialState = {
  errors: false,
  success: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ERROR_EMIT:
      return {
        ...state,
        errors: action.payload
      };

    case SUCCESS_EMIT:
      return {
        ...state,
        success: action.payload
      };

    default:
      return state;
  }
};
