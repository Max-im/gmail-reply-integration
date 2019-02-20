const { google } = require("googleapis");
const { client_id, client_secret, redirect_uris } = require("../../../config");

const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
module.exports = auth;
