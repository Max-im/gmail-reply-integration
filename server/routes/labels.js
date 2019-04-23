const express = require("express");
const router = express.Router();
const isLogged = require("../middlevares/isLogged");
const Label = require("../model/Label");
const getDbAccounts = require("./utils/common/getDbAccounts");
const getLabels = require("./utils/labels/getLabels");
const removeOldLabels = require("./utils/labels/removeOldLabels");
const storeNewLabels = require("./utils/labels/storeNewLabels");

// @route   GET labels
// @desc    Get all labels
// @access  Private
router.get("/", isLogged, async (req, res) => {
  try {
    // get started labels
    const startLabels = await Label.find();

    // get all accounts
    const accounts = await getDbAccounts();
    if (accounts.length === 0) return res.json([]);

    // fetch accounts labels
    const labels = await getLabels(accounts);
    const labelNames = labels
      .map(label => label.name)
      .filter((v, i, a) => a.indexOf(v) === i);

    // save new labels
    await storeNewLabels(labelNames, startLabels);

    // remove old labels
    await removeOldLabels(labelNames, startLabels);

    // get updated labels
    const actualLabels = await Label.find().sort({ name: 1 });

    res.json(actualLabels);
  } catch (err) {
    console.error(err, "\n========\n Error getting labels\n========\n");
    res.status(400).json("Error getting labels");
  }
});

// @route   PUT labels/:id
// @desc    Get all labels
// @access  Private
router.put("/:id", isLogged, async (req, res) => {
  try {
    const { id: _id } = req.params;
    const current = await Label.findOne({ _id });
    await Label.findOneAndUpdate(
      { _id },
      { $set: { checked: !current.checked } }
    );
    res.end();
  } catch (err) {
    console.error(err, "\n========\n Error toggle label \n========\n");
    res.status(400).json("Error toggle label");
  }
});

// @route   GET labels/target-labels-map
// @desc    Return all target labels
// @access  Private
router.get("/target-labels-map", async (req, res) => {
  try {
    // get all accounts
    const accounts = await getDbAccounts();

    // get all labels
    const labels = await getLabels(accounts);

    // get db labels
    const dbLabels = await Label.find();

    // filter checked db labels only
    const targetDbLabels = dbLabels
      .filter(label => label.checked)
      .map(label => label.name);

    // filter gmail labels matched by name with checked labels
    const targetLabels = labels.filter(label =>
      targetDbLabels.includes(label.name)
    );

    res.json(targetLabels);
  } catch (err) {
    console.error(err, "\n========\n Error getting labels map \n========\n");
    res.status(400).json("Error getting labels map");
  }
});

module.exports = router;
