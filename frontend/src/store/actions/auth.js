import axios from "axios";

import jwt_decode from "jwt-decode";
import { LOGIN, LOGOUT, ERROR_EMIT } from "./constants";
import { setAuthToken } from "./utils/general";
import { getTokenFromCode } from "./utils/auth";

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
