import axios from "axios";
import jwt_decode from "jwt-decode";
import {
  client_id_user,
  client_secret_user,
  redirect_uri_user
} from "../../config";
import { SET_USER, AUTH_ERROR } from "./constants";
import { getTokenFromCode, setAuthToken } from "./utils/auth";

// login
export const onLogin = response => async dispatch => {
  try {
    dispatch({ type: AUTH_ERROR, payload: null });
    const { code } = response;
    const authData = {
      code,
      client_id: client_id_user,
      client_secret: client_secret_user,
      redirect_uri: redirect_uri_user
    };
    const token = await getTokenFromCode(authData);

    axios.post("/auth/login", { token }).then(res => {
      const token = res.data;
      localStorage.setItem("outBandSales", token);

      setAuthToken(token);

      // Decode token to get User data
      const decoded = jwt_decode(token);

      dispatch({ type: SET_USER, payload: decoded });
    });
  } catch (err) {
    if (err && err.response && err.response.data) {
      return dispatch({ type: AUTH_ERROR, payload: err.response.data });
    }
    dispatch({ type: AUTH_ERROR, payload: "AUTH ERROR" });
    console.error(err);
  }
};

// Logout
export const onLogout = () => dispatch => {
  try {
    if (!window.confirm("Do you want to Logout?")) return;
    dispatch({ type: AUTH_ERROR, payload: null });
    localStorage.removeItem("outBandSales");
    setAuthToken(false);
    dispatch({ type: SET_USER, payload: {} });
  } catch (err) {
    if (err && err.response && err.response.data) {
      return dispatch({ type: AUTH_ERROR, payload: err.response.data });
    }
    dispatch({ type: AUTH_ERROR, payload: "LOGOUT ERROR" });
    console.error(err);
  }
};
