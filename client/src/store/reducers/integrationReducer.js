import {
  ADD_INFO,
  UPDATE_INFO,
  TOGGLE_PROGRESS,
  CHANGE_PROGRESS
} from "../actions/constants";

const initialState = {
  actions: [],
  showProgress: false,
  progress: 0,
  progressTitle: "Title"
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_INFO:
      return {
        ...state,
        actions: [
          ...state.actions,
          {
            text: action.payload,
            type: action.meta === "error" ? "error" : "info"
          }
        ]
      };

    case UPDATE_INFO:
      return {
        ...state,
        actions: []
      };

    case TOGGLE_PROGRESS:
      return {
        ...state,
        showProgress: action.payload
      };

    case CHANGE_PROGRESS:
      return {
        ...state,
        progress: action.payload,
        progressTitle: action.meta
      };

    default:
      return state;
  }
};
