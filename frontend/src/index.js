import React from "react";
import ReactDOM from "react-dom";
import jwt_decode from "jwt-decode";
import { Provider } from "react-redux";

import store from "./store";
import "./scss/style.css";
import App from "./components/App";
import { setAuthToken } from "./actions/utils";
import { LOGIN } from "./actions/constants";

// Check for token
if (localStorage.outBandSales) {
  setAuthToken(localStorage.outBandSales);
  const decoded = jwt_decode(localStorage.outBandSales);
  store.dispatch({ type: LOGIN, payload: decoded });
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
