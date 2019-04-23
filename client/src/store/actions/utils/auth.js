import axios from "axios";

// retrieve token by code
export const getTokenFromCode = authData => {
  return new Promise((resolve, reject) => {
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    const params = { ...authData, grant_type: "authorization_code" };

    axios
      .post(
        "https://www.googleapis.com/oauth2/v4/token",
        {},
        { headers, params }
      )
      .then(res => resolve(res.data))
      .catch(err => {
        console.error(err);
        reject("Error retrieving tokin");
      });
  });
};

// Set up Auth axios header
export const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};
