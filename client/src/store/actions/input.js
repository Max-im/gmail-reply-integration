import axios from "axios";
import { GET_SHEETS, GET_FILES, SHEET_ERROR } from "./constants";

// get all user files
export const getFiles = () => async dispatch => {
  const { data: files } = await axios.get("/input/files");
  dispatch({ type: GET_FILES, payload: files });
};

// get selected file sheets
export const getSheets = id => async dispatch => {
  try {
    dispatch({ type: SHEET_ERROR, payload: null });
    var { data: sheets } = await axios.get(`/input/file/${id}`);
    dispatch({ type: GET_SHEETS, payload: sheets });
  } catch (err) {
    const payload = "Error getting sheet names, check permissions";
    dispatch({ type: SHEET_ERROR, payload });
  }
};
