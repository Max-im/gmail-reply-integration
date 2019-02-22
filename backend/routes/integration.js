const express = require("express");
const router = express.Router();
const isLogged = require("../middlevares/isLogged");
const asyncLoop = require("node-async-loop");
const jwt = require("jsonwebtoken");
const { secretOrKey } = require("../config");

const Thread = require("../model/Threads");
const Label = require("../model/Label");
const Accounts = require("../model/Accounts");

const getFiles = require("./utils/spreadSheet/getFiles");
const getSheetNames = require("./utils/spreadSheet/getSheetNames");
const getAccountById = require("./utils/db/getAccountById");
const getSheetData = require("./utils/spreadSheet/getSheetData");
const updateUserThreads = require("./utils/common/updateUserThreads");
const outputSheetData = require("./utils/spreadSheet/outputSheetData");
const getAccountHistory = require("./utils/gmail/getAccountHistory");
const getAccountLabels = require("./utils/gmail/getAccountLabels");

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
router.post("/update/", isLogged, async (req, res) => {
  try {
    // get accounts
    const { id, options, labels } = req.body;
    const account = await getAccountById(id);

    // receive new changed threads
    options.startHistoryId = account.historyId;
    const { history, nextPageToken, historyId } = await getAccountHistory(
      account,
      options
    );

    if (!nextPageToken) return res.json({ nextPageToken, historyId });

    // update user threads
    const idArr = history
      .map(item => item.messages[0].threadId)
      .filter((v, i, a) => a.indexOf(v) === i);

    await updateUserThreads(idArr, labels, account);

    res.json({ nextPageToken, historyId });
  } catch (err) {
    res.status(400).json(err);
  }
});

// @route   POST integration/compare
// @desc    get threads matched by email
// @access  Private
router.post("/update-history", isLogged, async (req, res) => {
  const { id: _id, historyId } = req.body;
  await Accounts.findOneAndUpdate(
    { _id },
    { $set: { historyId, date: new Date() } }
  );
  res.json();
});

// @route   GET integration/compare
// @desc    get threads matched by email
// @access  Private
router.post("/compare", isLogged, async (req, res) => {
  try {
    const { emailArr } = req.body;

    // get all the threads
    const threads = await Thread.find();
    if (threads.length === 0) return res.json([]);

    const mapped = emailArr.map(email => {
      const matchedThreads = threads
        // filter all matched
        .filter(item => {
          if (item.people.some(person => person === email)) return true;
          return false;
        })
        // map body and labels
        .map(item => ({ body: item.body, labels: item.labels }));
      return matchedThreads;
    });

    // filter by "check" labels
    const labels = await Label.find({ type: "check" });
    const labelNames = labels.map(item => item.name);
    const threadArr = mapped.map(item =>
      item
        .filter(thread =>
          thread.labels.some(label => labelNames.includes(label))
        )
        .map(item => ({
          body: item.body,
          labels: item.labels.filter(label => labelNames.includes(label))
        }))
    );

    res.json(threadArr);
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

module.exports = router;
