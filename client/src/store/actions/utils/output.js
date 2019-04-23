import axios from "axios";
import asyncLoop from "node-async-loop";

export const output = (targetThreads, fileId, sheetName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const formated = formateIntegrationData(targetThreads);
      await outputData(formated, fileId, sheetName);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

// format data for output
function formateIntegrationData(result) {
  const formated = [];

  result.forEach(item => {
    const theItem = [];

    // body
    const body = [];
    item.forEach(thread => body.push(thread.body));

    // labels
    const labels = [];
    item.forEach(thread =>
      thread.labels.forEach(label => {
        if (!labels.includes(label)) labels.push(label);
      })
    );

    theItem[0] = body.join("\n===============\n");
    theItem.push(...labels.map(item => item));
    formated.push(theItem);
  });

  // header
  let maxLen = 1;
  formated.forEach(item => {
    if (item.length > maxLen) maxLen = item.length;
  });
  const header = ["Body"];
  for (var i = 1; i < maxLen; i++) {
    header.push("Label-" + i);
  }
  formated.unshift(header);

  const resultArr = formated.map(item => {
    const forReturn = [];
    const theItem = item.filter(arr => arr.length > 0);
    for (var i = 0; i < maxLen; i++) {
      if (theItem[i]) {
        forReturn.push(theItem[i]);
      } else {
        forReturn.push("");
      }
    }
    return forReturn;
  });

  return resultArr;
}

// output data
// output each column separatly, for reduce server load time
function outputData(formated, fileId, sheetName) {
  const arr = [];
  for (var i = 0; i < formated[0].length; i++) {
    arr.push(i);
  }

  return new Promise((resolve, reject) => {
    asyncLoop(
      arr,
      (col, nextCol) => {
        const data = formated.map(item => item[col]);
        axios
          .post("/output/sheet", { fileId, sheetName, data })
          .then(() => nextCol())
          .catch(err => reject(err));
      },
      () => resolve()
    );
  });
}
