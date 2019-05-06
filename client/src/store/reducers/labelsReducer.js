import {
  GET_LABELS,
  LABELS_IN_PROCESS,
  LABELS_ERROR
} from "../actions/constants";

export const labelsState = {
  inProcess: true,
  labels: [],
  error: null
};

export default (state = labelsState, action) => {
  switch (action.type) {
    // fetch labels
    case GET_LABELS:
      return {
        ...state,
        labels: action.payload,
        inProcess: false
      };

    // labels busy
    case LABELS_IN_PROCESS:
      return {
        ...state,
        inProcess: true
      };

    //error
    case LABELS_ERROR:
      return {
        ...state,
        error: action.payload
      };

    default:
      return state;
  }
};
