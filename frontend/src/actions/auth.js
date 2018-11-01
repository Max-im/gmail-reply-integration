import axios from "axios";
import jwt_decode from "jwt-decode";
import { LOGIN, LOGOUT, ERROR_EMIT } from "./constants";
import { setAuthToken } from "./utils";
import { getUsers } from "./settingsActions";

// Register
export const onRegister = userData => dispatch => {
  axios
    .post("/auth/register", userData)
    .then(res => dispatch(getUsers()))
    .catch(err => dispatch({ type: ERROR_EMIT, payload: err.response.data }));
};

// Login
export const onLogin = (userData, history) => dispatch => {
  axios
    .post("/auth/login", userData)
    .then(res => {
      const { token } = res.data;
      localStorage.setItem("outBandSales", token);

      // Set Token into axios header
      setAuthToken(token);

      // Decode token to get User data
      const decoded = jwt_decode(token);

      dispatch({ type: LOGIN, payload: decoded });

      history.push("/integration");
    })
    .catch(err => dispatch({ type: ERROR_EMIT, payload: err.response.data }));
};

// Logout
export const onLogout = () => dispatch => {
  localStorage.removeItem("outBandSales");
  setAuthToken(false);
  dispatch({ type: LOGOUT });
};
