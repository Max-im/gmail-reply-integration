import { GET_LABELS, LABELS_IN_PROCESS } from "../actions/constants";

const initialState = {
  inProcess: true,
  labels: []
};

export default (state = initialState, action) => {
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

    default:
      return state;
  }
};
