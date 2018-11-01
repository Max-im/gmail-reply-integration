import axios from "axios";
import { GET_ALL_USERS, GET_ACCOUNTS } from "./constants";

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
