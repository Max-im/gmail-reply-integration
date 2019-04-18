const asyncLoop = require("node-async-loop");
const Label = require("../../../model/Label");

module.exports = labels => {
  return new Promise(async (resolve, reject) => {
    try {
      const dbLabels = await Label.find();
      const dbLabelsName = dbLabels.map(item => item.name);

      asyncLoop(
        dbLabelsName,
        async (dbLabel, nextLabel) => {
          if (!labels.includes(dbLabel)) {
            await Label.findOneAndDelete({ name: dbLabel });
          }
          nextLabel();
        },
        () => resolve()
      );
    } catch (err) {
      console.error("Error getting labels", err);
      reject("Error getting labels");
    }
  });
};
