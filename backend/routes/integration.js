const express = require("express");
const passport = require("passport");
const router = express.Router();
const oAuth2Client = require("./utils/auth/index");

// database
const getDbEmails = require("./utils/db/getDbEmails");
const getDbAccounts = require("./utils/db/getDbAccounts");
// spreadSheet
const getSheetNames = require("./utils/spreadSheet/getSheetNames");
const getSheetData = require("./utils/spreadSheet/getSheetData");
const updateSheet = require("./utils/spreadSheet//updateSheet");
// gmail
const getEmailLabelAndBody = require("./utils/gmail/getEmailLabelAndBody");

// @route   GET integration/test
// @desc    Test
// @access  Public
router.get("/test", (req, res) => res.json({ integration: "success" }));

// const progressIntegration = { progress: 0, status: "Prepare..." };
// let isLaunched = false;

// @route   POST integration/launch
// @desc    Get DB data
// @access  Private
router.post(
  "/launch",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    progressIntegration.progress = 0;
    progressIntegration.status = "Prepare...";
    if (isLaunched) return;
    isLaunched = true;

    try {
      // receive data from frontend
      const { fileId, sheetName, fromDb } = req.body;
      let dbEmails;

      // get emails from db
      if (fromDb) {
        dbEmails = await getDbEmails();
      }

      // get accounts from db
      const authArr = await getDbAccounts();

      // get target emails from SS
      // @return - arr with emails and number of the last column
      oAuth2Client.setCredentials(authArr[0]);
      const { emailArr, tabLen } = await getSheetData(
        oAuth2Client,
        fileId,
        sheetName
      );

      // init progress status
      progressIntegration.status = "Checking...";

      // get Labels and bodies
      const resultArr = await getEmailLabelAndBody(
        authArr,
        emailArr,
        oAuth2Client,
        progressIntegration,
        dbEmails,
        fromDb
      );

      // update progress values
      progressIntegration.progress = 1;
      progressIntegration.status = "Print results";

      oAuth2Client.setCredentials(authArr[0]);
      const stat = await updateSheet(
        oAuth2Client,
        resultArr,
        fileId,
        sheetName,
        tabLen
      );

      // Save result data in db
      progressIntegration.status = "Done";
      isLaunched = false;

      // return
      res.json(stat);
    } catch (err) {
      console.log(err);
      res.status(err.error.code).json(err.error.message);
    }
  }
);

// // @route   GET integration/progress
// // @desc    Get progress
// // @access  Private
// router.get(
//   "/progress",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     res.json(progressIntegration);
//   }
// );

// @route   GET integration/sheets/:fileId
// @desc    Get File Sheets
// @access  Private
router.get(
  "/sheets/:fileId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { fileId } = req.params;
      const authArr = await getDbAccounts();

      oAuth2Client.setCredentials(authArr[0]);
      const sheetNames = await getSheetNames(oAuth2Client, fileId);

      res.json(sheetNames);
    } catch (err) {
      res.status(404).json(err);
    }
  }
);

// ===========================================================
// FRONTEND LOGIC
// ===========================================================

// @route   POST integration/get-emails-list
// @desc    Get Emails List
// @access  Private
router.post(
  "/get-emails-list",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { fileId, sheetName } = req.body;
      // get accounts from db
      const authArr = await getDbAccounts();

      // get emails from db
      const dbEmails = await getDbEmails();

      // get target emails from SS
      // @return - arr with emails and number of the last column
      oAuth2Client.setCredentials(authArr[0]);
      const { emailArr, tabLen } = await getSheetData(
        oAuth2Client,
        fileId,
        sheetName
      );
      res.json({ emailArr, tabLen, dbEmails });
    } catch (err) {
      console.log(err);
      res.status(err.error.code).json(err.error.message);
    }
  }
);

// @route   POST integration/get-email-data
// @desc    Get Each email data
// @access  Private
router.post(
  "/get-email-data",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // receive data from frontend
      const { fileId, sheetName, email } = req.body;

      // get accounts from db
      const authArr = await getDbAccounts();

      // get Labels and bodies
      const emailData = await getEmailLabelAndBody(
        authArr,
        email,
        oAuth2Client
      );

      res.json(emailData);
    } catch (err) {
      console.log(err);
      res.status(err.error.code).json(err.error.message);
    }
  }
);

// @route   POST integration/output-data
// @desc    Save data in ss
// @access  Private
router.post(
  "/output-data",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // receive data from frontend
      const { fileId, sheetName, tabLen, result } = req.body;

      // get accounts from db
      const authArr = await getDbAccounts();

      oAuth2Client.setCredentials(authArr[0]);
      const stat = await updateSheet(
        oAuth2Client,
        result,
        fileId,
        sheetName,
        tabLen
      );

      res.json(stat);
    } catch (err) {
      console.log(err);
      res.status(err.error.code).json(err.error.message);
    }
  }
);

module.exports = router;
