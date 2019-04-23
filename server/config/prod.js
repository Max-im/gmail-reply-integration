module.exports = {
  db: process.env.MONGO_DB,
  secretOrKey: process.env.SECRET_OR_KEY,

  account: {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI,
    scope: process.env.SCOPE
  },

  user: {
    client_id: process.env.USER_CLIENT_ID,
    client_secret: process.env.USER_CLIENT_SECRET,
    redirect_uri: process.env.USER_REDIRECT_URI,
    scope: process.env.USER_SCOPE
  }
};
