import axios from "axios";

export const getTokenFromCode = ({
  code,
  redirect_url,
  client_id,
  client_secret
}) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://www.googleapis.com/oauth2/v4/token",
        {},
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          params: {
            code,
            client_id,
            client_secret,
            grant_type: "authorization_code",
            redirect_uri: redirect_url
          }
        }
      )
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.error(err.response.data);
        reject("Error retrieving tokin");
      });
  });
};
