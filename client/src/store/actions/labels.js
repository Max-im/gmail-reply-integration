import axios from "axios";
import { LABELS_IN_PROCESS, GET_LABELS, LABELS_ERROR } from "./constants";

// get all labels
export const getLabels = () => dispatch => {
  dispatch({ type: LABELS_ERROR, payload: null });
  axios
    .get("/labels")
    .then(res => dispatch({ type: GET_LABELS, payload: res.data }))
    .catch(err => {
      if (err && err.response && err.response.data) {
        return dispatch({ type: LABELS_ERROR, payload: err.response.data });
      }
      console.error(err);
    });
};

// toggle labels status
export const toggleCheck = id => dispatch => {
  dispatch({ type: LABELS_IN_PROCESS });
  dispatch({ type: LABELS_ERROR, payload: null });
  axios
    .put(`/labels/${id}`)
    .then(() => dispatch(getLabels()))
    .catch(err => {
      if (err && err.response && err.response.data) {
        return dispatch({ type: LABELS_ERROR, payload: err.response.data });
      }
      console.error(err);
    });
};
