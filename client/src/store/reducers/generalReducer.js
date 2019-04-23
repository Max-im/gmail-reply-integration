import { ADD_INFO } from "../actions/constants";

const initialState = {
  inProcess: false,
  errors: [],
  info: [],
  success: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
