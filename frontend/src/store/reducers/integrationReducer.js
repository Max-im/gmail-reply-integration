import {
  GET_FILES,
  GET_SHEETS,
  SELECT_FILE,
  SELECT_SHEET,
  CHANGE_STAGE
} from "../actions/constants";

const initialState = {
  stage: 1,
  files: [],
  theFile: false,
  filesReady: false,
  sheets: [],
  theSheet: false,
  sheetsReady: false
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

    case CHANGE_STAGE:
      return {
        ...state,
        stage: action.payload,
        sheetsReady: false
      };

    case SELECT_FILE:
      return {
        ...state,
        theFile: action.payload
      };

    case SELECT_SHEET:
      return {
        ...state,
        theSheet: action.payload
      };

    default:
      return state;
  }
};
