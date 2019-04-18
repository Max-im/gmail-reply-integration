module.exports = {
  db: process.env.MONGO_DB,
  secretOrKey: process.env.SECRET_OR_KEY,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri1: process.env.REDIRECT_URI1,
  redirect_uri2: process.env.REDIRECT_URI2,
  scope: process.env.SCOPE,

  userClientId: process.env.USER_CLIENT_ID,
  userClientSecret: process.env.USER_CLIENT_SECRET,
  userRedirectUris: process.env.USER_REDIRECT_URL,
  userScope: process.env.USER_CLIENT_SCOPE
};
