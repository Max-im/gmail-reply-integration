const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const getProfile = require("./utils/auth/getProfile");
const isLogged = require("../middlevares/isLogged");
const { secretOrKey } = require("../config");
const Accounts = require("../model/Accounts");
const ThreadsMap = require("../model/ThreadsMap");

// @route   GET accounts
// @desc    Get all accounts
// @access  Private
router.get("/", isLogged, async (req, res) => {
  try {
    const accounts = await Accounts.find();
    const formated = Array.from(accounts).map(account => {
      const { _id, email, picture, name } = account;
      return { _id, email, picture, name };
    });
    res.json(formated);
  } catch (err) {
    console.error(err, "\n============\nError getting account\n============\n");
    res.status(400).json("Error getting accounts");
  }
});

// @route   POST accounts
// @desc    Create new Account
// @access  Private
router.post("/", isLogged, async (req, res) => {
  try {
    const { token } = req.body;
    const profile = await getProfile(token);
    const theAccount = await Accounts.findOne({ id: profile.id });
    // return error
    if (theAccount) return res.status(401).json("The account already exists");
    // create account
    await Accounts.create({ ...profile, token: jwt.sign(token, secretOrKey) });

    res.end();
  } catch (err) {
    console.error(err, "\n===========\nError creating account\n===========\n");
    res.status(400).json("Error creating account");
  }
});

// @route   DELETE settings/:id
// @desc    Remove Account by id
// @access  Private
router.delete("/:id", isLogged, async (req, res) => {
  try {
    const { id: _id } = req.params;
    // remove account
    const { email } = await Accounts.findOneAndDelete({ _id });
    // remove all account's threads
    await ThreadsMap.deleteMany({ email });
    res.end();
  } catch (err) {
    console.error(err, "\n===========\nError deleting account\n===========\n");
    res.status(400).json("Error deleting account");
  }
});

module.exports = router;
