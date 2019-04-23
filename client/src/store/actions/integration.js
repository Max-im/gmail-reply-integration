import { getDbThreads, updateDbThreads } from "./utils/integration";

import { getInputData } from "./utils/getInputData";
import { output } from "./utils/output";
import { compare } from "./utils/compare";
import { update } from "./utils/update";

export const onLaunch = (fileId, sheetName) => async dispatch => {
  // GET INPUT
  const { sheetData, threads } = await getInputData(fileId, sheetName);

  // get gb threads
  const dbThreads = await getDbThreads();
  console.log(dbThreads.length, "got from db");

  // UPDATE DB DATA
  const actualThreads = await update(threads, dbThreads);

  // COMPARE
  const targetThreads = await compare(actualThreads, sheetData);

  // OUTPUT
  await output(targetThreads, fileId, sheetName);
};
