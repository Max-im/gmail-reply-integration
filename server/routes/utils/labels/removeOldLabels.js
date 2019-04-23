const Label = require("../../../model/Label");

module.exports = (gmailLabels, dbLabels) => {
  return new Promise(async (resolve, reject) => {
    try {
      const old = dbLabels
        .filter(label => !gmailLabels.includes(label.name))
        .map(label => label.name);

      if (old.length === 0) return resolve();
      await Label.deleteMany({ name: { $in: old } });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};
