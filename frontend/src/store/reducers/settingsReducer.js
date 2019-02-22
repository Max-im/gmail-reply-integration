import {
  GET_ACCOUNTS,
  GET_LABELS,
  UPLOAD_PROGRESS
} from "../actions/constants";

const initialState = {
  accounts: [],
  labels: [],
  accountsReady: false,
  labelsReady: false,
  uploadProgress: "0%"
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNTS:
      return {
        ...state,
        accounts: action.payload,
        accountsReady: true
      };

    case GET_LABELS:
      return {
        ...state,
        labels: action.payload,
        labelsReady: true
      };

    case UPLOAD_PROGRESS:
      return {
        ...state,
        uploadProgress: action.payload
      };

    default:
      return state;
  }
};
