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
  const decoded = jwt.verify(authorization, secretOrKey);
  const { uid } = decoded;
  if (!uid) {
    return res.status(401).json("Not Authorized User");
  }
  // search the user in db
  const theUser = await User.findOne({ uid });
  if (theUser) {
    req.user = theUser;
    next();
  } else {
    return res.status(401).json("Not Authorized User");
  }
};
