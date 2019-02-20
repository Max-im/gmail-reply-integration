import { GET_ACCOUNTS, GET_LABELS } from "../actions/constants";

const initialState = {
  accounts: [],
  labels: [],
  accountsReady: false,
  labelsReady: false
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

    default:
      return state;
  }
};
