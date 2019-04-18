import axios from "axios";
import { redirect_uri, client_id, client_secret } from "../../../config";

export const getTokenFromCode = code => {
  return new Promise((resolve, reject) => {
    const params = {
      code,
      client_id,
      client_secret,
      grant_type: "authorization_code",
      redirect_uri
    };

    axios
      .post(
        "https://www.googleapis.com/oauth2/v4/token",
        {},
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          params
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
