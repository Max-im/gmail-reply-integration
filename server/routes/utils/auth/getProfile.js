const axios = require("axios");

module.exports = tokens => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    };
    axios
      .get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", options)
      .then(res => {
        const { id, name, email, picture } = res.data;
        resolve({ id, email, name, picture });
      })
      .catch(err => reject(err));
  });
};
