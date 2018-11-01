module.exports = {
  MONGO_DB: process.env.MONGO_DB,
  secretOrKey: process.env.SECRET_OR_KEY,
  client_id: process.env.CLIENT_ID,
  project_id: process.env.PROJECT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uris: process.env.REDIRECT_URIS,
  scope: process.env.SCOPE
};
