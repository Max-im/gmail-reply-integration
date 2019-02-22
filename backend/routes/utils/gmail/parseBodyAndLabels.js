const base64 = require("js-base64");

module.exports = function parseBodyAndLabels(data) {
  // get body
  let body;
  const parts = data.payload.parts;
  if (parts && parts.length > 0) {
    const lastPart = parts[parts.length - 1];
    if (lastPart.body.size > 0) {
      body = base64.Base64.decode(lastPart.body.data)
        .replace(/\n+/g, " ")
        .replace(/\s+/g, " ")
        .replace(/\t+/g, " ")
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/------ Original message------.*/g, "")
        .replace(/HarrisBusiness.*/g, "")
        .replace(/Best Regards,\s+Liam Harris.*/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();
    }
  }
  // skip invalid values
  if (!body || body === "�w^~)�") body = "";

  // get label
  let labels = data.labelIds.filter(label => label.match(/Label_/));

  return { body, labels };
};
