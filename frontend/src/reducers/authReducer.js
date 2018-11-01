import { LOGIN, LOGOUT } from "../actions/constants";

const initialState = {
  isAuth: false,
  user: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuth: true,
        user: action.payload
      };

    case LOGOUT:
      return {
        ...state,
        isAuth: false,
        user: null
      };

    default:
      return state;
  }
};
