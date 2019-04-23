import axios from "axios";
import { GET_SHEETS, GET_FILES, SHEET_ERROR, FILES_ERROR } from "./constants";

// get all user files
export const getFiles = () => dispatch => {
  dispatch({ type: FILES_ERROR, payload: null });
  axios
    .get("/input/files")
    .then(res => dispatch({ type: GET_FILES, payload: res.data }))
    .catch(err => {
      if (err && err.response && err.response.data) {
        return dispatch({ type: FILES_ERROR, payload: err.response.data });
      }
      console.error(err);
    });
};

// get selected file sheets
export const getSheets = id => async dispatch => {
  try {
    dispatch({ type: SHEET_ERROR, payload: null });
    var { data: sheets } = await axios.get(`/input/file/${id}`);
    dispatch({ type: GET_SHEETS, payload: sheets });
  } catch (err) {
    if (err && err.response && err.response.data) {
      return dispatch({ type: SHEET_ERROR, payload: err.response.data });
    }
    console.error(err);
  }
};
