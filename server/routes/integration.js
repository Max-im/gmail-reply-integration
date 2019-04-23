const express = require("express");
const router = express.Router();
const isLogged = require("../middlevares/isLogged");
const ThreadMap = require("../model/ThreadsMap");
const getAccountById = require("./utils/integration/getAccountById");
const getOneThreadById = require("./utils/integration/getOneThreadById");
const getAccountThreads = require("./utils/integration/getAccountThreads");

// @route   POST integration/get-all-account-threads
// @desc    Return all account threads
// @access  Private
router.post("/get-all-account-threads", isLogged, async (req, res) => {
  try {
    const { id, options } = req.body;
    const account = await getAccountById(id);
    const accountThreads = await getAccountThreads({ account, options });
    res.json(accountThreads);
  } catch (err) {
    console.error(err, "\n========\n Error getting gmail threads\n========\n");
    res.status(400).json("Error getting gmail threads");
  }
});

// @route   GET integration/get-db-threads
// @desc    Return all threads from db
// @access  Private
router.get("/get-db-threads", isLogged, async (req, res) => {
  try {
    const dbThreads = await ThreadMap.find();
    res.json(dbThreads);
  } catch (err) {
    console.error(err, "\n========\n Error getting db threads\n========\n");
    res.status(400).json("Error getting db threads");
  }
});

// @route   POST integration/update-thread
// @desc    Update thread by id
// @access  Private
router.post("/update-thread", isLogged, async (req, res) => {
  try {
    const { thread } = req.body;
    const account = await getAccountById(thread.uId);

    // fetch updated thread data
    const theThread = await getOneThreadById({ id: thread.id, account });
    await ThreadMap.findOneAndUpdate({ id: thread.id }, theThread);
    res.end();
  } catch (err) {
    console.error(err, "\n========\n Error updating thread\n========\n");
    res.status(400).json("Error updating thread");
  }
});

// @route   POST integration/create-thread
// @desc    Create thread by id
// @access  Private
router.post("/create-thread", isLogged, async (req, res) => {
  try {
    const { thread } = req.body;
    const account = await getAccountById(thread.uId);

    // fetch updated thread data
    var theThread = await getOneThreadById({ id: thread.id, account });
    await ThreadMap.create(theThread);
    res.end();
  } catch (err) {
    console.error(err, "\n========\n Error creating thread\n========\n");
    res.status(400).json("Error creating thread");
  }
});

// @route   DELETE integration/delete-thread
// @desc    Delete thread by id
// @access  Private
router.post("/delete-thread", isLogged, async (req, res) => {
  try {
    const { removeIdArr } = req.body;
    await ThreadMap.deleteMany({ id: { $in: removeIdArr } });
    res.end();
  } catch (err) {
    console.error(err, "\n========\n Error deleting thread\n========\n");
    res.status(400).json("Error deleting thread");
  }
});

module.exports = router;
