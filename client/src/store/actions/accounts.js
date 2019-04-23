import axios from "axios";
import { ACCOUNTS_IN_PROCESS, GET_ACCOUNTS, ACCOUNTS_ERROR } from "./constants";
import { getTokenFromCode } from "./utils/auth";
import { client_id, client_secret, redirect_uri } from "../../config";
import { getLabels } from "./labels";

// get all accounts
export const getAccounts = () => dispatch => {
  dispatch({ type: ACCOUNTS_ERROR, payload: null });
  axios
    .get("/accounts")
    .then(res => dispatch({ type: GET_ACCOUNTS, payload: res.data }))
    .catch(err => {
      if (err && err.response && err.response.data) {
        return dispatch({ type: ACCOUNTS_ERROR, payload: err.response.data });
      }
      console.error(err);
    });
};

// Create new Account
export const createAccount = response => async dispatch => {
  dispatch({ type: ACCOUNTS_IN_PROCESS, payload: true });
  dispatch({ type: ACCOUNTS_ERROR, payload: null });
  try {
    const { code } = response;
    const authData = { code, client_id, client_secret, redirect_uri };
    const token = await getTokenFromCode(authData);
    axios.post("/accounts", { token }).then(() => {
      dispatch(getAccounts());
      dispatch(getLabels());
    });
  } catch (err) {
    if (err && err.response && err.response.data) {
      return dispatch({ type: ACCOUNTS_ERROR, payload: err.response.data });
    }
    console.error(err);
  }
};

// remove account by id
export const removeAccount = id => dispatch => {
  dispatch({ type: ACCOUNTS_IN_PROCESS, payload: true });
  dispatch({ type: ACCOUNTS_ERROR, payload: null });
  axios
    .delete(`/accounts/${id}`)
    .then(() => {
      dispatch(getAccounts());
      dispatch(getLabels());
    })
    .catch(err => {
      if (err && err.response && err.response.data) {
        return dispatch({ type: ACCOUNTS_ERROR, payload: err.response.data });
      }
      console.error(err);
    });
};
