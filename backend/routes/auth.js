const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const getProfile = require("./utils/gmail/getProfile");

const { secretOrKey, userClientId, userScope } = require("../config");

const User = require("../model/User");

// @route   GET auth/test
// @desc    Test
// @access  Public
router.get("/test", (req, res) => res.json({ auth: "success" }));

// @route   POST auth/login
// @desc    Login with google
// @access  Public
router.post("/login", async (req, res) => {
  const { token } = req.body;
  const { email, gId: uid, img: avatar, name } = await getProfile(token);
  let theUser = await User.findOne({ uid });

  // register
  if (!theUser) {
    const newUser = new User({
      email,
      uid,
      avatar,
      name,
      token: jwt.sign(token, secretOrKey)
    });
    await newUser.save();
    theUser = newUser;
  }

  const payload = { ...theUser._doc };

  jwt.sign(payload, secretOrKey, (err, token) => {
    if (err) return res.status(400).json(err);
    res.json({ token });
  });
});

// @route   GET auth/cred
// @desc    Get credentials
// @access  Public
router.get("/cred", (req, res) => {
  console.log(userScope.join(" "));
  res.json({ client_id: userClientId, scope: userScope.join(" ") });
});

module.exports = router;
