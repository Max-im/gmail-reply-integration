import axios from "axios";
import {
  GET_ALL_USERS,
  GET_ACCOUNTS,
  GET_LABELS,
  GET_BLACK_LIST
} from "./constants";

// Get All Users
export const getUsers = () => dispatch => {
  axios
    .get("/settings/users")
    .then(res => dispatch({ type: GET_ALL_USERS, payload: res.data }))
    .catch(err => console.log(err.response.data));
};

// Remove User
export const onRemoveUser = id => dispatch => {
  if (window.confirm("Are You Sure?")) {
    axios
      .delete(`/settings/users/${id}`)
      .then(res => dispatch(getUsers()))
      .catch(err => console.log(err.response.data));
  }
};

// Get Accounts
export const getAccoutns = () => dispatch => {
  axios
    .get("/settings/accounts")
    .then(res => dispatch({ type: GET_ACCOUNTS, payload: res.data }))
    .catch(err => console.error(err.response.data));
};

// Create Account
export const createAccount = () => dispatch => {
  axios
    .post("/settings/accounts")
    .then(res => window.location.replace(res.data.url))
    .catch(err => console.log(err.response.data));
};

// remove Account
export const removeAccount = id => dispatch => {
  axios
    .delete(`/settings/accounts/${id}`)
    .then(res => dispatch(getAccoutns()))
    .catch(err => console.log(err.response.data));
};

// get all gmail labels
export const getLabels = () => dispatch => {
  axios
    .get("/settings/labels")
    .then(res => {
      const { labels, blackList } = res.data;
      dispatch({ type: GET_LABELS, payload: labels });
      dispatch({ type: GET_BLACK_LIST, payload: blackList });
    })
    .catch(err => console.log(err.response.data));
};

// add label to blacklist
export const addLabelToBlackList = name => dispatch => {
  axios
    .post("/settings/labels", { name })
    .then(res => dispatch(getLabels()))
    .catch(err => console.log(err.response.data));
};

// remove label from blacklist
export const removeLabelFromBlackList = id => dispatch => {
  axios
    .delete(`/settings/labels/${id}`)
    .then(res => dispatch(getLabels()))
    .catch(err => console.log(err.response.data));
};
