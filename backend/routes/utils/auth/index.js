const { google } = require("googleapis");
const { client_id, client_secret, redirect_uri1 } = require("../../../config");

const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uri1);
module.exports = auth;
