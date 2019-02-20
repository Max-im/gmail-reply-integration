import axios from "axios";

export const getTokenFromCode = code => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://www.googleapis.com/oauth2/v4/token",
        {},
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          params: {
            code,
            client_id:
              "969544593152-tmvbkq2uhpalst6o75gbgjkcfj7hs1u2.apps.googleusercontent.com",
            client_secret: "wQEzqtRQUIiMc0E9wpjEgMFD",
            grant_type: "authorization_code",
            redirect_uri: "http://localhost:3000"
          }
        }
      )
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log(err.response.data);
        reject("Error retrieving tokin");
      });
  });
};
