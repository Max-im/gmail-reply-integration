import axios from "axios";
import { ERROR_EMIT, LABELS_IN_PROCESS, GET_LABELS } from "./constants";

// get all labels
export const getLabels = () => dispatch => {
  axios
    .get("/labels")
    .then(res => dispatch({ type: GET_LABELS, payload: res.data }))
    .catch(err => {
      console.error(err);
    });
};

// toggle labels status
export const toggleCheck = id => dispatch => {
  dispatch({ type: LABELS_IN_PROCESS });
  axios
    .put(`/labels/${id}`)
    .then(() => dispatch(getLabels()))
    .catch(err => {
      console.error(err);
    });
};
