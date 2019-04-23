import {
  GET_ACCOUNTS,
  ACCOUNTS_IN_PROCESS,
  ACCOUNTS_ERROR
} from "../actions/constants";

const initialState = {
  inProcess: true,
  accounts: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    // fetch accounts
    case GET_ACCOUNTS:
      return {
        ...state,
        accounts: action.payload,
        inProcess: false
      };

    // accounts busy
    case ACCOUNTS_IN_PROCESS:
      return {
        ...state,
        inProcess: true
      };

    // error
    case ACCOUNTS_ERROR:
      return {
        ...state,
        error: action.payload
      };

    default:
      return state;
  }
};
