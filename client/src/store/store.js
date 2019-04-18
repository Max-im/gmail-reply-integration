import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";

const initialstate = {};
const middleware = [thunk];
let middlewareContent;
if (process.env.NODE_ENV === "production") {
  middlewareContent = applyMiddleware(...middleware);
} else {
  middlewareContent = compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
}

const store = createStore(rootReducer, initialstate, middlewareContent);

export default store;
