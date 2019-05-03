import axios from "axios";
import jwt_decode from "jwt-decode";
import {
  client_id_user,
  client_secret_user,
  redirect_uri_user
} from "../../config";
import { SET_USER, AUTH_ERROR } from "./constants";
import { setAuthToken } from "./utils/auth";

// login
export const onLogin = response => async dispatch => {
  if (!response || !response.code) {
    return dispatch({ type: AUTH_ERROR, payload: "Invalid code" });
  }

  const { code } = response;
  const authData = {
    code,
    client_id: client_id_user,
    client_secret: client_secret_user,
    redirect_uri: redirect_uri_user
  };
  dispatch({ type: AUTH_ERROR, payload: null });

  return axios
    .post("/auth/login", { authData })
    .then(res => {
      const token = res.data;
      localStorage.setItem("outBandSales", token);

      setAuthToken(token);

      // Decode token to get User data
      const decoded = jwt_decode(token);

      dispatch({ type: SET_USER, payload: decoded });
    })
    .catch(err => {
      if (err && err.response && err.response.data) {
        return dispatch({ type: AUTH_ERROR, payload: err.response.data });
      }
      dispatch({ type: AUTH_ERROR, payload: "AUTH ERROR" });
      console.error(err);
    });
};

// Logout
export const onLogout = () => dispatch => {
  dispatch({ type: AUTH_ERROR, payload: null });
  localStorage.removeItem("outBandSales");
  setAuthToken(false);
  dispatch({ type: SET_USER, payload: {} });
};
