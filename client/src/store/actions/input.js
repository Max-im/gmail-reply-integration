import axios from "axios";
import {
  GET_SHEETS,
  GET_FILES,
  SHEET_ERROR,
  FILES_ERROR,
  UPDATE_SHEETS
} from "./constants";

// get all user files
export const getFiles = () => dispatch => {
  dispatch({ type: FILES_ERROR, payload: null });
  return axios
    .get("/input/files")
    .then(res => dispatch({ type: GET_FILES, payload: res.data }))
    .catch(err => {
      if (err && err.response && err.response.data) {
        return dispatch({ type: FILES_ERROR, payload: err.response.data });
      }
      dispatch({ type: FILES_ERROR, payload: "FILES ERROR" });
      console.error(err);
    });
};

// get selected file sheets
export const getSheets = id => dispatch => {
  if (!id) return dispatch({ type: SHEET_ERROR, payload: "invalid sheet id" });
  dispatch({ type: SHEET_ERROR, payload: null });
  dispatch({ type: UPDATE_SHEETS });

  return axios
    .get(`/input/file/${id}`)
    .then(res => dispatch({ type: GET_SHEETS, payload: res.data }))
    .catch(err => {
      if (err && err.response && err.response.data) {
        return dispatch({ type: SHEET_ERROR, payload: err.response.data });
      }
      dispatch({ type: SHEET_ERROR, payload: "SHEET ERROR" });
      console.error(err);
    });
};
