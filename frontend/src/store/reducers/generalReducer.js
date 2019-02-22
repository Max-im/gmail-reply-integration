import {
  START_PROCESS,
  END_PROCESS,
  ERROR_EMIT,
  SUCCESS_EMIT,
  CLOSE_ERROR,
  ADD_INFO,
  CLOSE_INFO
} from "../actions/constants";

const initialState = {
  inProcess: false,
  errors: [],
  info: [],
  success: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    // overlay
    // ======================================
    case START_PROCESS:
      return {
        ...state,
        inProcess: true
      };

    case END_PROCESS:
      return {
        ...state,
        inProcess: false
      };

    // error
    // ======================================
    case ERROR_EMIT:
      return {
        ...state,
        errors: [...state.errors, action.payload],
        inProcess: false
      };

    case CLOSE_ERROR:
      return {
        ...state,
        errors: [...state.errors.filter(item => item !== action.payload)]
      };

    // info
    // ======================================
    case ADD_INFO:
      return {
        ...state,
        info: [...state.info, action.payload]
      };

    case CLOSE_INFO:
      return {
        ...state,
        info: [...state.info.filter(item => item !== action.payload)]
      };

    // success
    // ======================================
    case SUCCESS_EMIT:
      return {
        ...state,
        success: action.payload
      };

    default:
      return state;
  }
};
