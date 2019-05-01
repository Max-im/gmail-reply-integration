import { SET_USER, AUTH_ERROR } from "../actions/constants";

export const authState = {
  isAuth: false,
  user: {},
  error: null
};

export default (state = authState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        isAuth: Object.keys(action.payload).length > 0,
        user: action.payload
      };

    case AUTH_ERROR:
      return {
        ...state,
        error: action.payload
      };

    default:
      return state;
  }
};
