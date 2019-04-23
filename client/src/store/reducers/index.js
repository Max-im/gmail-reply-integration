import { combineReducers } from "redux";

import auth from "./authReducer";
import accounts from "./accountsReducer";
import labels from "./labelsReducer";
import input from "./inputReducer";
import integration from "./integrationReducer";

export default combineReducers({ auth, labels, accounts, input, integration });
