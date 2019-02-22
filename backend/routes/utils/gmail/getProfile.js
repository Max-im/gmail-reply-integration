const axios = require("axios");

module.exports = tokens => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    };
    axios
      .get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", options)
      .then(res => {
        const { id: gId, name, picture: img, email } = res.data;
        axios
          .get("https://www.googleapis.com/gmail/v1/users/me/profile", options)
          .then(res => {
            const { historyId } = res.data;
            resolve({ gId, name, img, email, historyId });
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
};
