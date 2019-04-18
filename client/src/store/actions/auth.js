import axios from "axios";

import jwt_decode from "jwt-decode";
import {
  LOGIN,
  LOGOUT,
  SAVE_AUTH_CRED,
  START_PROCESS,
  END_PROCESS
} from "./constants";
import { setAuthToken, addError } from "./utils/general";
import { getTokenFromCode } from "./utils/auth";

// login
export const onLogin = response => async dispatch => {
  try {
    const { code } = response;
    const token = await getTokenFromCode(code);

    axios
      .post("/auth/login", { token })
      .then(res => {
        const { token } = res.data;
        localStorage.setItem("outBandSales", token);

        setAuthToken(token);

        // Decode token to get User data
        const decoded = jwt_decode(token);

        dispatch({ type: LOGIN, payload: decoded });
      })
      .catch();
  } catch (err) {
    addError(err, dispatch);
  }
};

// Logout
export const onLogout = () => dispatch => {
  try {
    if (!window.confirm("Do you want to Logout?")) return;
    localStorage.removeItem("outBandSales");
    setAuthToken(false);
    dispatch({ type: LOGOUT });
  } catch (err) {
    addError(err, dispatch);
  }
};

// receive credentials
// !!! not secure, antipattern
export const getLoginCred = () => dispatch => {
  dispatch({ type: START_PROCESS });
  axios
    .get("/auth/cred")
    .then(res => {
      dispatch({ type: SAVE_AUTH_CRED, payload: { ...res.data } });
      dispatch({ type: END_PROCESS });
    })
    .catch(err => addError(err, dispatch));
};
