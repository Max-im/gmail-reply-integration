import { GET_FILES, GET_SHEETS, SHEET_ERROR } from "../actions/constants";

const initialState = {
  files: [],
  filesReady: false,
  sheets: [],
  sheetsReady: false,
  sheetError: null
};

export default (state = initialState, action) => {
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

    default:
      return state;
  }
};
