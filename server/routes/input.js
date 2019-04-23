const express = require("express");
const router = express.Router();
const isLogged = require("../middlevares/isLogged");
const jwt = require("jsonwebtoken");
const { secretOrKey } = require("../config");
const getFiles = require("./utils/input/getFiles");
const getSheetNames = require("./utils/input/getSheetNames");
const getSheetData = require("./utils/input/getSheetData");

// @route   GET input/files
// @desc    Get all user spreadsheets files
// @access  Private
router.get("/files", isLogged, async (req, res) => {
  try {
    const { user } = req;
    const token = jwt.verify(user.token, secretOrKey);
    const files = await getFiles(token);
    res.json(files);
  } catch (err) {
    console.error(err, "\n============\nError getting files\n=============\n");
    res.status(400).json("Error getting files");
  }
});

// @route   GET input/file/:id
// @desc    Get sheet names of the file
// @access  Private
router.get("/file/:id", isLogged, async (req, res) => {
  try {
    const { id } = req.params;
    const token = jwt.verify(req.user.token, secretOrKey);
    const sheets = await getSheetNames(token, id);
    res.json(sheets);
  } catch (err) {
    console.error(err, "\n============\n Error getting sheets\n============\n");
    res.status(400).json("Error getting sheets");
  }
});

// @route   GET input/:fileId/:sheetName
// @desc    Get file data
// @access  Private
router.get("/:fileId/:sheetName", isLogged, async (req, res) => {
  try {
    const { fileId, sheetName } = req.params;
    const token = jwt.verify(req.user.token, secretOrKey);
    const emailArr = await getSheetData(token, fileId, sheetName);
    res.json(emailArr);
  } catch (err) {
    console.error(err, "\n===========\n Error getting file data\n==========\n");
    res.status(400).json("Error getting file data");
  }
});

module.exports = router;
