import { ADD_INFO, UPDATE_INFO } from "../actions/constants";

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
            type: action.meta === "error" ? "error" : "info"
          }
        ]
      };

    case UPDATE_INFO:
      return {
        ...state,
        actions: []
      };

    default:
      return state;
  }
};
