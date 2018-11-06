import {
  GET_ALL_USERS,
  GET_ACCOUNTS,
  GET_LABELS,
  GET_BLACK_LIST
} from "../actions/constants";

const initialState = {
  allUsers: null,
  accounts: [],
  labels: null,
  blacklist: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_USERS:
      return {
        ...state,
        allUsers: action.payload
      };

    case GET_ACCOUNTS:
      return {
        ...state,
        accounts: action.payload
      };

    case GET_LABELS:
      return {
        ...state,
        labels: action.payload
      };

    case GET_BLACK_LIST:
      return {
        ...state,
        blacklist: action.payload
      };

    default:
      return state;
  }
};
