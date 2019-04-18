const express = require("express");
const asyncLoop = require("node-async-loop");
const router = express.Router();
const isLogged = require("../middlevares/isLogged");
const jwt = require("jsonwebtoken");
const { secretOrKey } = require("../config");

const Thread = require("../model/Threads");
const Label = require("../model/Label");
const Accounts = require("../model/Accounts");
const ThreadMap = require("../model/ThreadsMap");

const getFiles = require("./utils/spreadSheet/getFiles");
const getDbAccounts = require("./utils/db/getDbAccounts");
const getSheetNames = require("./utils/spreadSheet/getSheetNames");
const getAccountById = require("./utils/db/getAccountById");
const getSheetData = require("./utils/spreadSheet/getSheetData");
const updateUserThreads = require("./utils/common/updateUserThreads");
const outputSheetData = require("./utils/spreadSheet/outputSheetData");
const getAccountHistory = require("./utils/gmail/getAccountHistory");
const getAccountLabels = require("./utils/gmail/getAccountLabels");

const getOneThreadById = require("./utils/gmail/getOneThreadById");
const getAccountThreads = require("./utils/gmail/getAccountThreads");

// @route   GET integration/test
// @desc    Test
// @access  Public
router.get("/test", (req, res) => res.json({ integration: "success" }));

// @route   GET integration/files
// @desc    Get all user spreadsheets files
// @access  Private
router.get("/files", isLogged, async (req, res) => {
  try {
    const { user } = req;
    const token = jwt.verify(user.token, secretOrKey);
    const files = await getFiles(token);
    res.json(files);
  } catch (err) {
    res.status(400).json(err);
  }
});

// @route   GET integration/file/:id
// @desc    Get sheet names of the file
// @access  Private
router.get("/file/:id", isLogged, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const token = jwt.verify(user.token, secretOrKey);
    const sheets = await getSheetNames(token, id);
    res.json(sheets);
  } catch (err) {
    res.status(400).json(err);
  }
});

// @route   GET integration/sheet/:fileId/:sheetName
// @desc    Get file data
// @access  Private
router.get("/sheet/:fileId/:sheetName", isLogged, async (req, res) => {
  try {
    const { fileId, sheetName } = req.params;
    const { user } = req;
    const token = jwt.verify(user.token, secretOrKey);
    const emailArr = await getSheetData(token, fileId, sheetName);
    res.json(emailArr);
  } catch (err) {
    res.status(400).json(err);
  }
});

// @route   POST integration/update/
// @desc    Update account data
// @access  Private
router.post("/update", isLogged, async (req, res) => {
  try {
    // get account
    const { id, options, labels } = req.body;
    const account = await getAccountById(id);

    // receive new changed threads
    options.startHistoryId = account.historyId;
    const { history, nextPageToken, historyId } = await getAccountHistory(
      account,
      options
    );

    // get updated threads ids
    const idArr = history
      .map(item => item.messages[0].threadId)
      .filter((v, i, a) => a.indexOf(v) === i);

    // update user threads
    await updateUserThreads(idArr, labels, account);

    res.json({ nextPageToken, historyId });
  } catch (err) {
    res.status(400).json(err);
  }
});

// @route   POST integration/update-history
// @desc    account history id update
// @access  Private
router.post("/update-history", isLogged, async (req, res) => {
  const { id: _id, historyId } = req.body;
  await Accounts.findOneAndUpdate(
    { _id },
    { $set: { historyId, date: new Date() } }
  );
  res.json();
});

// @route   GET integration/labels
// @desc    return the all labels
// @access  Private
router.get("/labels", isLogged, async (req, res) => {
  try {
    const labels = await Label.find();
    res.json(labels);
  } catch (err) {
    res.status(400).json(err);
  }
});

// @route   GET integration/compare
// @desc    get threads matched by email
// @access  Private
router.post("/compare", isLogged, async (req, res) => {
  try {
    // get all the threads
    const threads = await Thread.find();
    res.json(threads);
  } catch (err) {
    res.status(400).json(err);
  }
});

// @route   POST integration/sheet
// @desc    Output Data
// @access  Private
router.post("/sheet", isLogged, async (req, res) => {
  try {
    const { fileId, sheetName, data } = req.body;
    const { user } = req;
    const token = jwt.verify(user.token, secretOrKey);
    await outputSheetData(token, fileId, sheetName, data);
    res.json();
  } catch (err) {
    res.status(400).json(err);
  }
});

// @route   POST integration/get-all-account-threads
// @desc    Return all account threads
// @access  Private
router.post("/get-all-account-threads", isLogged, async (req, res) => {
  const { id, options, isNewAccount } = req.body;
  if (isNewAccount) var account = await getAccountById(id);

  try {
    var accountThreads = await getAccountThreads({
      account,
      isNewAccount,
      options
    });
  } catch (err) {
    res.status(400).json(err);
  }
  res.json(accountThreads);
});

// @route   GET integration/get-db-threads
// @desc    Return all threads from db
// @access  Private
router.get("/get-db-threads", isLogged, async (req, res) => {
  const dbThreads = await ThreadMap.find();
  res.json(dbThreads);
});

// @route   POST integration/update-thread
// @desc    Update thread by id
// @access  Private
router.post("/update-thread", isLogged, async (req, res) => {
  const { thread } = req.body;
  const account = await getAccountById(thread.uId);

  // fetch updated thread data
  var theThread = await getOneThreadById({ id: thread.id, account });
  await ThreadMap.findOneAndUpdate({ id: thread.id }, theThread);
  res.end();
});

// @route   POST integration/create-thread
// @desc    Create thread by id
// @access  Private
router.post("/create-thread", isLogged, async (req, res) => {
  const { thread } = req.body;
  const account = await getAccountById(thread.uId);

  // fetch updated thread data
  var theThread = await getOneThreadById({ id: thread.id, account });
  await ThreadMap.create(theThread);
  res.end();
});

// @route   DELETE integration/delete-thread
// @desc    Delete thread by id
// @access  Private
router.post("/delete-thread", isLogged, async (req, res) => {
  const { removeIdArr } = req.body;
  await ThreadMap.deleteMany({ id: { $in: removeIdArr } });
  res.end();
});

// @route   GET integration/target-labels-map
// @desc    Return all target labels
// @access  Private
router.get("/target-labels-map", async (req, res) => {
  // get all accounts
  const accounts = await getDbAccounts();

  // get all labels
  const labelsArr = [];
  asyncLoop(
    accounts,
    async (account, nextAccount) => {
      const labels = await getAccountLabels(account);
      labelsArr.push(
        ...labels
          .filter(label => label.type === "user")
          .map(label => ({
            id: label.id,
            name: label.name,
            email: account.email
          }))
      );
      nextAccount();
    },
    async () => {
      // filter by target labels
      const dbLabels = await Label.find();
      const targetDbLabels = dbLabels
        .filter(label => label.type === "check")
        .map(label => label.name);

      const targetLabels = labelsArr.filter(label =>
        targetDbLabels.includes(label.name)
      );

      res.json(targetLabels);
    }
  );
});

module.exports = router;
