const jwt = require("jsonwebtoken");
const { secretOrKey } = require("../config");
const User = require("../model/User");

module.exports = async (req, res, next) => {
  // get token
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json("Not Authorized User");
  }
  // retrieve user data
  const { id } = jwt.verify(authorization, secretOrKey);
  if (!id) return res.status(401).json("Not Authorized User");

  // search the user in db
  const theUser = await User.findOne({ id });
  if (theUser) {
    req.user = theUser;
    next();
  } else {
    return res.status(401).json("Not Authorized User");
  }
};
