import axios from "axios";
import jwt_decode from "jwt-decode";
import {
  client_id_user,
  client_secret_user,
  redirect_uri_user
} from "../../config";
import { LOGIN, LOGOUT } from "./constants";
import { getTokenFromCode, setAuthToken } from "./utils/auth";

// login
export const onLogin = response => async dispatch => {
  try {
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

      dispatch({ type: LOGIN, payload: decoded });
    });
  } catch (err) {
    console.error(err);
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
    console.error(err);
  }
};
