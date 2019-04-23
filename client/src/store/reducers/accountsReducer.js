import { GET_ACCOUNTS, ACCOUNTS_IN_PROCESS } from "../actions/constants";

const initialState = {
  inProcess: true,
  accounts: []
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

    default:
      return state;
  }
};
