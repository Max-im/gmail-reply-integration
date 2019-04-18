import { combineReducers } from "redux";

import authReducer from "./authReducer";
import generalReducer from "./generalReducer";
import integrationReducer from "./integrationReducer";
import settingsReducer from "./settingsReducer";

export default combineReducers({
  auth: authReducer,
  general: generalReducer,
  integration: integrationReducer,
  settings: settingsReducer
});
