import { LOGIN, LOGOUT, SAVE_AUTH_CRED } from "../actions/constants";

const initialState = {
  isAuth: false,
  user: null,
  client_id: false,
  scope: false,
  redirect_url: false,
  client_secret: false
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

    case SAVE_AUTH_CRED:
      return {
        ...state,
        client_id: action.payload.client_id,
        scope: action.payload.scope,
        redirect_url: action.payload.redirect_url,
        client_secret: action.payload.client_secret
      };

    default:
      return state;
  }
};
