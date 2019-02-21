import axios from "axios";

import jwt_decode from "jwt-decode";
import {
  LOGIN,
  LOGOUT,
  ERROR_EMIT,
  SAVE_AUTH_CRED,
  START_PROCESS,
  END_PROCESS
} from "./constants";
import { setAuthToken } from "./utils/general";
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
    dispatch({ type: ERROR_EMIT, payload: err });
  }
};

// Logout
export const onLogout = () => dispatch => {
  if (!window.confirm("Do you want to Logout?")) return;
  localStorage.removeItem("outBandSales");
  setAuthToken(false);
  dispatch({ type: LOGOUT });
};

// receive credentials
// !!! not secure, antipattern
export const getLoginCred = () => dispatch => {
  dispatch({ type: START_PROCESS });
  axios
    .get("/auth/cred")
    .then(res => {
      const { client_id, scope } = res.data;
      dispatch({ type: SAVE_AUTH_CRED, payload: { client_id, scope } });
      dispatch({ type: END_PROCESS });
    })
    .catch(() => {
      dispatch({ type: ERROR_EMIT, payload: "Cant receive auth credentials" });
      dispatch({ type: END_PROCESS });
    });
};
