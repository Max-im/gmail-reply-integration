import { GET_ALL_USERS, GET_ACCOUNTS } from "../actions/constants";

const initialState = {
  allUsers: null,
  accounts: []
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

    default:
      return state;
  }
};
