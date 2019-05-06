const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const isLogged = require("../middlevares/isLogged");
const { secretOrKey } = require("../config");
const outputSheetData = require("./utils/output/outputSheetData");

// @route   POST integration/sheet
// @desc    Output Data
// @access  Private
router.post("/sheet", isLogged, async (req, res) => {
  try {
    const { fileId, sheetName, data } = req.body;
    const { user } = req;
    const token = jwt.verify(user.token, secretOrKey);
    await outputSheetData(token, fileId, sheetName, data);
    res.end();
  } catch (err) {
    console.error(err, "\n========\n Output data Error \n========\n");
    res.status(400).json("Output data Error");
  }
});

module.exports = router;
