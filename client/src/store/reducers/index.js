import { combineReducers } from "redux";

import auth from "./authReducer";
import general from "./generalReducer";
import labels from "./labelsReducer";
import accounts from "./accountsReducer";
import input from "./inputReducer";

export default combineReducers({ auth, general, labels, accounts, input });
