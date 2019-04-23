const Label = require("../../../model/Label");

module.exports = (gmailLabels, dbLabels) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dbNames = dbLabels.map(item => item.name);
      const newLabels = gmailLabels
        .filter(label => !dbNames.includes(label))
        .map(label => ({ name: label }));

      if (newLabels.length === 0) return resolve();
      await Label.create(newLabels);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};
