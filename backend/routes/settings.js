const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const axios = require("axios");
const oAuth2Client = require("./utils/auth/index");

const User = require("../model/User");
const Accounts = require("../model/Accounts");
const Label = require("../model/Label");

const getLabels = require("./utils/gmail/getLabels");
const getDbAccounts = require("./utils/db/getDbAccounts");

const { secretOrKey, scope } = require("../config/key");

// @route   GET settings/test
// @desc    Return test
// @access  Public
router.get("/test", (req, res) => res.json({ settings: "success" }));

// @route   GET settings/users
// @desc    Return All Users
// @access  Private
router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.find().then(users => res.json(users));
  }
);

// @route   DELETE settings/users/:id
// @desc    Delete User
// @access  Private
router.delete(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOneAndDelete({ _id: req.params.id }).then(user => res.json(user));
  }
);

// @route   GET settings/accoutns
// @desc    Return all accounts
// @access  Private
router.get(
  "/accounts",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Accounts.find({})
      .then(acc => res.json(acc))
      .catch();
  }
);

// @route   POST settings/accoutns
// @desc    Create Account
// @access  Private
router.post(
  "/accounts",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const url = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope
    });

    res.json({ url });
  }
);

router.get("/accoutns/oauth", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oAuth2Client.getToken(code);
  const Authorization = `Bearer ${tokens.access_token}`;

  axios
    .get("https://www.googleapis.com/plus/v1/people/me", {
      headers: { Authorization }
    })
    .then(resp => {
      const { data } = resp;

      Accounts.findOne({ gId: data.id }).then(acc => {
        if (acc) return res.redirect("http://localhost:3000/settings");

        const newAccount = new Accounts({
          gId: data.id,
          name: data.displayName,
          img: data.image.url,
          token: jwt.sign(
            {
              access_token: tokens.access_token,
              expiry_date: tokens.expiry_date,
              refresh_token: tokens.refresh_token,
              id_token: tokens.id_token,
              scope: tokens.scope,
              token_type: "Bearer"
            },
            secretOrKey
          )
        });

        newAccount
          .save()
          .then(acc => res.redirect("http://localhost:3000/settings"))
          .catch(err => console.log(err));
      });
    })
    .catch(err => res.json(err.response.data));
});

// @route   DELETE settings/accoutns/:id
// @desc    Remove Account
// @access  Private
router.delete(
  "/accounts/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Accounts.findByIdAndDelete(req.params.id).then(acc => res.json(acc));
  }
);

// @route   GET settings/labels
// @desc    Get labels
// @access  Private
router.get(
  "/labels",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const authArr = await getDbAccounts();

    const { labels, blackList } = await getLabels(authArr, oAuth2Client);
    res.json({ labels, blackList });
  }
);

// @route   POST settings/labels
// @desc    Add label to black list
// @access  Private
router.post(
  "/labels",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { name } = req.body;
    const errors = {};
    Label.findOne({ name }).then(blackLabel => {
      if (blackLabel) {
        errors.label = "The Label already exist in black list";
        res.status(400).json(errors);
      }
      const newLabel = new Label({ name });
      newLabel.save().then(label => res.json(label));
    });
  }
);

// @route   DELETE settings/labels/:id
// @desc    Remove label from black list
// @access  Private
router.delete(
  "/labels/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id } = req.params;
    Label.findByIdAndDelete(id).then(label => res.json(label));
  }
);

module.exports = router;
