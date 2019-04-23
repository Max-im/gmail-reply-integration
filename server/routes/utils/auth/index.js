const { google } = require("googleapis");
const config = require("../../../config");

// meta can be one of "account" or "user"
module.exports = meta => {
  const { client_id, client_secret, redirect_uri } = config[meta];
  const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
  return auth;
};
