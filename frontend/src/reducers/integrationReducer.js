import {
  GET_SHEETS_NAMES,
  SPINNER_TOGGLE,
  UPDATE_PROGRESS_BAR,
  SUCCESS_EMIT
} from "../actions/constants";

const initialState = {
  stat: [],
  sheetsNames: [],
  showSpinner: false,
  success: false,
  progress: false,
  status: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SHEETS_NAMES:
      return {
        ...state,
        sheetsNames: action.payload
      };

    case SPINNER_TOGGLE:
      return {
        ...state,
        showSpinner: action.payload
      };

    case UPDATE_PROGRESS_BAR:
      return {
        ...state,
        progress: action.payload.progress,
        status: action.payload.status
      };

    case SUCCESS_EMIT:
      return {
        ...state,
        status: "Done"
      };

    default:
      return state;
  }
};
