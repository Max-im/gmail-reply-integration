const { google } = require("googleapis");
const {
  userClientId: client_id,
  userClientSecret: client_secret,
  userRedirectUris: redirect_uris
} = require("../../../config");

const authU = new google.auth.OAuth2(client_id, client_secret, redirect_uris);
module.exports = authU;
