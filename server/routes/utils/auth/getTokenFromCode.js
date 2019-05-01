const axios = require("axios");

module.exports = authData => {
  return new Promise((resolve, reject) => {
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    const params = { ...authData, grant_type: "authorization_code" };

    return axios
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
