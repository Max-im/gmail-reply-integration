const { google } = require("googleapis");
const {
  client_secret,
  client_id,
  redirect_uris
} = require("../../../config/key");

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

module.exports = oAuth2Client;
