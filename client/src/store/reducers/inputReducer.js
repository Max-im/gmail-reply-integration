import {
  GET_FILES,
  GET_SHEETS,
  SHEET_ERROR,
  FILES_ERROR,
  UPDATE_SHEETS
} from "../actions/constants";

export const inputState = {
  files: [],
  filesReady: false,
  filesError: null,
  sheets: [],
  sheetsReady: false,
  sheetError: null
};

export default (state = inputState, action) => {
  switch (action.type) {
    case GET_FILES:
      return {
        ...state,
        files: action.payload,
        filesReady: true
      };

    case GET_SHEETS:
      return {
        ...state,
        sheets: action.payload,
        sheetsReady: true
      };

    case SHEET_ERROR:
      return {
        ...state,
        sheetError: action.payload
      };

    case FILES_ERROR:
      return {
        ...state,
        filesError: action.payload
      };

    case UPDATE_SHEETS:
      return {
        ...state,
        sheets: [],
        sheetsReady: false
      };

    default:
      return state;
  }
};
