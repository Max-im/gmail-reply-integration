import axios from "axios";
import { errorHandle } from "./errorHandle";
import { CONNECT_GET_LABEL_MAP, CONNECT_GET_COMPRED } from "../constants";
import store from "../../store";

const { getState } = store;

/** ======================================================================
 * compareWithSheetData(sheetData)
 * @description compare db threads with sheet data
 */
export const compareWithSheetData = () => dispatch => {
  const { sheetData, dbThreads, labelMap } = getState().connect;
  // filter by people
  const byPeople = sheetData.map(item => {
    return dbThreads.filter(thread => thread.people.includes(item));
  });

  // construct labels ids
  const targetLabelsIds = labelMap.map(label => label.id);

  // filater by labels
  const byLabels = byPeople.map(threadsArr => {
    if (threadsArr.length === 0) return [];
    return threadsArr
      .filter(thread =>
        thread.labels.some(label => targetLabelsIds.includes(label))
      )
      .map(thread => ({
        ...thread,
        labels: thread.labels
          .filter(label => targetLabelsIds.includes(label))
          .map(label => labelMap.find(dbLab => dbLab.id === label).name)
      }));
  });

  dispatch({ type: CONNECT_GET_COMPRED, payload: byLabels });
};

/**
 * getLabelsMap()
 */
export const getLabelsMap = () => dispatch => {
  return axios
    .get("/labels/target-labels-map")
    .then(res => dispatch({ type: CONNECT_GET_LABEL_MAP, payload: res.data }))
    .catch(err => errorHandle(err, "Error getting labels map"));
};
