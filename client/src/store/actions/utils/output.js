import axios from "axios";
import { ADD_INFO } from "../constants";
import { errorHandle } from "./errorHandle";
import store from "../../store";

const { getState } = store;

export const output = (fileId, sheetName) => dispatch => {
  dispatch({ type: ADD_INFO, payload: "Output data" });
  const { compared } = getState().connect;

  return new Promise(async resolve => {
    const formated = formateIntegrationData(compared);
    await outputData(formated, fileId, sheetName);

    dispatch({ type: ADD_INFO, payload: "Success" });
    resolve();
  });
};

// format data for output
function formateIntegrationData(compared) {
  const formated = [];

  compared.forEach(item => {
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
async function outputData(formated, fileId, sheetName) {
  const arr = [];
  for (var i = 0; i < formated[0].length; i++) {
    arr.push(i);
  }

  for (let col of arr) {
    const data = formated.map(item => item[col]);
    await axios
      .post("/output/sheet", { fileId, sheetName, data })
      .catch(err => errorHandle(err, "Output error"));
  }
}
