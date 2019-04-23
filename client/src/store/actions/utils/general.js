import axios from "axios";
import { ADD_INFO } from "../constants";

// add info on screen
export const addInfo = (payload, dispatch) => {
  dispatch({ type: ADD_INFO, payload });
  setTimeout(() => {
    dispatch({ type: CLOSE_INFO, payload });
  }, 6000);
};
