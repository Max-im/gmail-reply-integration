import axios from "axios";
import { ACCOUNTS_IN_PROCESS, GET_ACCOUNTS } from "./constants";
import { getTokenFromCode } from "./utils/auth";
import { client_id, client_secret, redirect_uri } from "../../config";
import { getLabels } from "./labels";

// get all accounts
export const getAccounts = () => dispatch => {
  axios
    .get("/accounts")
    .then(res => dispatch({ type: GET_ACCOUNTS, payload: res.data }))
    .catch(err => {
      console.error(err);
    });
};

// Create new Account
export const createAccount = response => async dispatch => {
  dispatch({ type: ACCOUNTS_IN_PROCESS, payload: true });
  const { code } = response;
  if (!code) {
    return console.error("Cant retrieve a code");
  }
  const authData = { code, client_id, client_secret, redirect_uri };
  const token = await getTokenFromCode(authData);
  axios
    .post("/accounts", { token })
    .then(() => {
      dispatch(getAccounts());
      dispatch(getLabels());
    })
    .catch(err => console.error(err.response.data));
};

// remove account by id
export const removeAccount = id => dispatch => {
  dispatch({ type: ACCOUNTS_IN_PROCESS, payload: true });
  axios
    .delete(`/accounts/${id}`)
    .then(() => {
      dispatch(getAccounts());
      dispatch(getLabels());
    })
    .catch(err => console.error(err.response.data));
};
