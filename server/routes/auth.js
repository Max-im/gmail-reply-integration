const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const getProfile = require("./utils/auth/getProfile");
const { secretOrKey } = require("../config");
const User = require("../model/User");

// @route   POST auth/login
// @desc    Login with google
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { token } = req.body;
    const userData = await getProfile(token);
    const dbUser = await User.findOne({ id: userData.id });

    // return from db
    if (dbUser) return res.json(jwt.sign(userData, secretOrKey));

    // register
    await User.create({ ...userData, token: jwt.sign(token, secretOrKey) });
    return res.json(jwt.sign(userData, secretOrKey));
  } catch (err) {
    console.error(err, "\n================\n Auth error \n================\n");
    res.status(400).json("Auth error");
  }
});

module.exports = router;
