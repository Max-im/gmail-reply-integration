import axios from "axios";
import { ACCOUNTS_IN_PROCESS, GET_ACCOUNTS, ACCOUNTS_ERROR } from "./constants";
import { client_id, client_secret, redirect_uri } from "../../config";
import { getLabels } from "./labels";

// get all accounts
export const getAccounts = () => dispatch => {
  return axios
    .get("/accounts")
    .then(res => {
      dispatch({ type: GET_ACCOUNTS, payload: res.data });
      dispatch({ type: ACCOUNTS_ERROR, payload: null });
    })
    .catch(err => {
      if (err && err.response && err.response.data) {
        return dispatch({ type: ACCOUNTS_ERROR, payload: err.response.data });
      }
      dispatch({ type: ACCOUNTS_ERROR, payload: "GET ACCOUNTS ERROR" });
      console.error(err);
    });
};

// Create new Account
export const createAccount = response => async dispatch => {
  if (!response || !response.code) {
    return dispatch({ type: ACCOUNTS_ERROR, payload: "Invalid code" });
  }
  dispatch({ type: ACCOUNTS_IN_PROCESS });
  const { code } = response;
  const authData = { code, client_id, client_secret, redirect_uri };
  return axios
    .post("/accounts", { authData })
    .then(() => {
      dispatch({ type: ACCOUNTS_ERROR, payload: null });
      dispatch(getAccounts());
      dispatch(getLabels());
    })
    .catch(err => {
      if (err && err.response && err.response.data) {
        return dispatch({ type: ACCOUNTS_ERROR, payload: err.response.data });
      }
      dispatch({ type: ACCOUNTS_ERROR, payload: "CREATE ACCOUNT ERROR" });
      console.error(err);
    });
};

// remove account by id
export const removeAccount = id => dispatch => {
  dispatch({ type: ACCOUNTS_IN_PROCESS });
  dispatch({ type: ACCOUNTS_ERROR, payload: null });
  return axios
    .delete(`/accounts/${id}`)
    .then(() => {
      dispatch(getAccounts());
      dispatch(getLabels());
    })
    .catch(err => {
      if (err && err.response && err.response.data) {
        return dispatch({ type: ACCOUNTS_ERROR, payload: err.response.data });
      }
      dispatch({ type: ACCOUNTS_ERROR, payload: "REMOVE ACCOUNT ERROR" });
      console.error(err);
    });
};
