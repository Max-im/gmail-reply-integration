const { google } = require("googleapis");
const columnMap = require("./columnMap");

const updateSheet = (
  auth,
  emailData,
  fileId,
  tableName,
  tableLength,
  labels
) => {
  const outputData = [];
  let labelsCount = 0;
  const firstColumn = columnMap(tableLength - 0 + 1);
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = fileId;
  const header = ["Body"];

  emailData.forEach(item => {
    const itemArr = [];
    let bodyText = item.body.join("\n=====================\n");

    // max characters num in one SpreadSheet = 50000, cut of the tail for print in
    if (bodyText.length > 49990) bodyText = bodyText.slice(0, 49990) + "...";
    itemArr.push(bodyText);

    item.labels
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort()
      .forEach((label, i) => {
        if (labels.includes(label)) {
          if (i > labelsCount) labelsCount = i;
          itemArr.push(label);
        }
      });

    outputData.push(itemArr);
  });

  for (let i = 0; i <= labelsCount; i++) header.push("Label-" + (i + 1));

  outputData.unshift(header);

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.append(
      {
        spreadsheetId,
        range: `${tableName}!${firstColumn}1:${firstColumn}10000`,
        valueInputOption: "RAW",
        resource: {
          values: outputData
        }
      },
      (err, res) => {
        if (err) {
          return reject({ msg: err.errors[0].message });
        }
        resolve(emailData.map(item => item.labels));
      }
    );
  });
};

module.exports = updateSheet;
