const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const registerValidation = require("../validate/registerValidation");
const loginValidation = require("../validate/loginValidation");
const User = require("../model/User");
const secretOrKey = require("../config/key").secretOrKey;

// @route   GET auth/test
// @desc    Test
// @access  Public
router.get("/test", (req, res) => res.json({ auth: "success" }));

// @route   POST auth/login
// @desc    Login
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = loginValidation(req.body);
  if (!isValid) return res.status(400).json(errors);

  const { email, password } = req.body;
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "The User Not Found";
      return res.status(404).json(errors);
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          email: user.email
        };

        jwt.sign(payload, secretOrKey, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   POST auth/register
// @desc    Register new User
// @access  Private
router.post(
  "/register",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = registerValidation(req.body);
    if (!isValid) return res.status(400).json(errors);

    const { email, password } = req.body;
    User.findOne({ email }).then(user => {
      if (user) {
        errors.email = "The User already exist";
        return res.status(400).json(errors);
      }
      const newUser = new User({ email, password });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    });
  }
);

module.exports = router;
