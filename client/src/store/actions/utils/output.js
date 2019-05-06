import axios from "axios";
import { ADD_INFO } from "../constants";
import { errorHandle } from "./errorHandle";

export const output = (fileId, sheetName, getState) => async dispatch => {
  dispatch({ type: ADD_INFO, payload: "Output data" });
  const { compared } = getState().connect;
  const formated = formateIntegrationData(compared);

  const arr = [];
  for (var i = 0; i < formated[0].length; i++) {
    arr.push(i);
  }

  for (let col of arr) {
    const data = formated.map(item => item[col]);
    await outputData(data, fileId, sheetName);
  }
  dispatch({ type: ADD_INFO, payload: "Success" });
};

// format data for output
export const formateIntegrationData = compared => {
  const formated = [];

  compared.forEach(item => {
    // body
    const bodyArr = [];
    item.forEach(thread => bodyArr.push(thread.body));
    const body = bodyArr.join("\n===============\n");

    // labels
    const labels = [];
    item.forEach(thread =>
      thread.labels.forEach(label => {
        if (!labels.includes(label)) labels.push(label);
      })
    );

    formated.push([body, ...labels]);
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
};

// output data
// output each column separatly, for reduce server load time
export const outputData = (data, fileId, sheetName) => {
  return axios
    .post("/output/sheet", { fileId, sheetName, data })
    .then(res => res.data)
    .catch(err => errorHandle(err, "Output error"));
};
