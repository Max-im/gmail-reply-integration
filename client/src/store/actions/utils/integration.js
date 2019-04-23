import axios from "axios";
import { ADD_INFO } from "../constants";

// get all threads from db
export const getDbThreads = dispatch => {
  return new Promise((resolve, reject) => {
    axios
      .get("/integration/get-db-threads")
      .then(res => {
        resolve(res.data);
        const payload = `Get ${res.data.length} threads from db`;
        dispatch({ type: ADD_INFO, payload });
      })
      .catch(err => reject(err));
  });
};
