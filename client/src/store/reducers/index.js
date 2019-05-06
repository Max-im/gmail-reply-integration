import { combineReducers } from "redux";

import auth from "./authReducer";
import accounts from "./accountsReducer";
import labels from "./labelsReducer";
import input from "./inputReducer";
import display from "./displayReducer";
import connect from "./connectReducer";

export default combineReducers({
  auth,
  labels,
  accounts,
  input,
  display,
  connect
});
