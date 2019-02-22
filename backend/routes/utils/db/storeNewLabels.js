const asyncLoop = require("node-async-loop");
const Label = require("../../../model/Label");

module.exports = labels => {
  return new Promise(async (resolve, reject) => {
    try {
      const dbLabels = await Label.find();
      const dbLabelsName = dbLabels.map(item => item.name);

      // save new Labels as ingnore
      asyncLoop(
        labels,
        async (labelName, nextLabel) => {
          if (!dbLabelsName.includes(labelName)) {
            const newLabel = new Label({ name: labelName });
            await newLabel.save();
          }
          nextLabel();
        },
        () => resolve()
      );
    } catch (err) {
      reject(err);
    }
  });
};
