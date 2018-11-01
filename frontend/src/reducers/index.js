import { combineReducers } from "redux";

import authReducer from "./authReducer";
import integrationReducer from "./integrationReducer";
import messagesReducer from "./messagesReducer";
import settingsReducer from "./settingsReducer";

export default combineReducers({
  auth: authReducer,
  integration: integrationReducer,
  settings: settingsReducer,
  messages: messagesReducer
});
