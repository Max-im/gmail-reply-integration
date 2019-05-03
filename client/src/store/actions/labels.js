import axios from "axios";
import { LABELS_IN_PROCESS, GET_LABELS, LABELS_ERROR } from "./constants";

// get all labels
export const getLabels = () => dispatch => {
  return axios
    .get("/labels")
    .then(res => {
      dispatch({ type: GET_LABELS, payload: res.data });
      dispatch({ type: LABELS_ERROR, payload: null });
    })
    .catch(err => {
      if (err && err.response && err.response.data) {
        return dispatch({ type: LABELS_ERROR, payload: err.response.data });
      }
      dispatch({ type: LABELS_ERROR, payload: "LABEL ERROR" });
      console.error(err);
    });
};

// toggle labels status
export const toggleCheck = id => dispatch => {
  if (!id) return dispatch({ type: LABELS_ERROR, payload: "invalid label id" });

  dispatch({ type: LABELS_IN_PROCESS });

  return axios
    .put(`/labels/${id}`)
    .then(() => {
      dispatch({ type: LABELS_ERROR, payload: null });
      dispatch(getLabels());
    })
    .catch(err => {
      if (err && err.response && err.response.data) {
        return dispatch({ type: LABELS_ERROR, payload: err.response.data });
      }
      dispatch({ type: LABELS_ERROR, payload: "LABEL ERROR" });
      console.error(err);
    });
};
