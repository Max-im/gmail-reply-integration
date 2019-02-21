const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const getProfile = require("./utils/gmail/getProfile");
const getAllThreads = require("./utils/gmail/getAllThreads");
const getAccountLabels = require("./utils/gmail/getAccountLabels");
const storeNewLabels = require("./utils/db/storeNewLabels");
const removeOldLabels = require("./utils/db/removeOldLabels");
const getThreadDataById = require("./utils/gmail/getThreadDataById");

const Accounts = require("../model/Accounts");
const Label = require("../model/Label");
const Thread = require("../model/Threads");

const getLabels = require("./utils/gmail/getLabels");
const getDbAccounts = require("./utils/db/getDbAccounts");

const auth = require("./utils/auth");

const isLogged = require("../middlevares/isLogged");
const { secretOrKey, scope, redirect_uris } = require("../config");

// @route   GET settings/test
// @desc    Return test
// @access  Public
router.get("/test", (req, res) => res.json({ settings: "success" }));

// @route   GET settings/accoutns
// @desc    Return all accounts
// @access  Private
router.get("/accounts", isLogged, async (req, res) => {
  const accounts = await Accounts.find({});
  res.json(accounts);
});

// @route   GET settings/accoutns/google
// @desc    Create new Account
// @access  Private
router.get("/accounts/google", isLogged, (req, res) => {
  const url = auth.generateAuthUrl({ access_type: "offline", scope });
  console.log(redirect_uris);
  console.log(redirect_uris[1]);
  res.json({ url });
});

router.get("/account/oauth", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await auth.getToken(code);
  const user = await getProfile(tokens);
  user.token = jwt.sign(tokens, secretOrKey);
  const theAccount = await Accounts.findOne({ gId: user.gId });

  if (theAccount) return res.status(400).redirect(redirect_uris[1]);

  const newAccount = new Accounts(user);
  await newAccount.save();
  res.redirect(redirect_uris[1]);
});

// @route   POST settings/upload-accoutns
// @desc    Upload all Threads labeled user labels
// @access  Private
router.post("/upload-account", isLogged, async (req, res) => {
  const { id: _id } = req.body;
  const theAccount = await Accounts.findOne({ _id });

  const decoded = {
    ...theAccount._doc,
    token: jwt.verify(theAccount.token, secretOrKey)
  };

  // all account labels
  const accountLabels = await getAccountLabels(decoded);

  // filter user labels id
  const targetLabelsId = accountLabels
    .filter(item => item.type === "user")
    .map(item => item.id);
  if (targetLabelsId.length === 0) return res.json([]);

  const threads = await getAllThreads(decoded, targetLabelsId);

  res.json(threads);
});

// @route   GET settings/get-thread-data/:threadId/:accountId
// @desc    Retrieve data from particular thread
// @access  Private
router.get(
  "/get-thread-data/:threadId/:accountId",
  isLogged,
  async (req, res) => {
    try {
      const { threadId, accountId } = req.params;

      const theThreadInDb = await Thread.findOne({ threadId });
      if (theThreadInDb) return res.json(theThreadInDb);

      const theAccount = await Accounts.findOne({ _id: accountId });

      const decoded = {
        ...theAccount._doc,
        token: jwt.verify(theAccount.token, secretOrKey)
      };

      // all account labels
      const userLabels = await getAccountLabels(decoded);

      // retrieve thread data
      const options = { id: threadId, userLabels, email: decoded.email };
      const threadData = await getThreadDataById(options);

      // save thread in db
      const newThread = new Thread(threadData);
      await newThread.save();

      res.json(threadData);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

// @route   POST settings/store-uploaded
// @desc    Save threads in db
// @access  Private
router.post("/store-uploaded", isLogged, async (req, res) => {
  const { threadData } = req.body;
  await Accounts.findOneAndUpdate(
    { email: threadData[0].email },
    { $set: { isUploaded: true } }
  );
  res.json();
});

// @route   DELETE settings/accoutns/:id
// @desc    Remove Account
// @access  Private
router.delete("/accounts/:id", isLogged, async (req, res) => {
  const { id: _id } = req.params;
  const removedAccount = await Accounts.findOneAndDelete({ _id });
  const { email } = removedAccount;
  await Thread.deleteMany({ email });
  await res.json();
});

// @route   GET settings/labels
// @desc    Get labels
// @access  Private
router.get("/labels", async (req, res) => {
  // get accounts
  const accounts = await getDbAccounts();
  if (accounts.length === 0) return res.json([]);

  // retrieve all uniq accounts labels name
  const labels = await getLabels(accounts);

  // remove old labels from db
  await removeOldLabels(labels);

  // store new labels in db
  await storeNewLabels(labels);

  // fetch updated labels list
  const labelsArr = await Label.find();

  // return
  res.json(labelsArr);
});

// @route   POST settings/labels
// @desc    Add label to black list
// @access  Private
router.post("/labels", isLogged, async (req, res) => {
  const { id: _id, value } = req.body;
  await Label.findOneAndUpdate({ _id }, { $set: { type: value } });
  res.json();
});

module.exports = router;
