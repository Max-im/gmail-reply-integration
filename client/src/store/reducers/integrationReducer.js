import { ADD_INFO } from "../actions/constants";

const initialState = {
  actions: []
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
            type: action.payload === "error" ? "error" : "info"
          }
        ]
      };

    default:
      return state;
  }
};
