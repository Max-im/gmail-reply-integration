import axios from "axios";
import { ADD_INFO, CLOSE_INFO } from "../constants";

// Set up Auth axios header
export const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const addInfo = (payload, dispatch) => {
  dispatch({ type: ADD_INFO, payload });
  setTimeout(() => {
    dispatch({ type: CLOSE_INFO, payload });
  }, 6000);
};
