import axios from "axios";

export const compare = (actualThreads, sheetData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // get all labels
      const labelsMap = await getAccountsLabels();

      // compare with input data
      const targetThreads = compareInputData(
        actualThreads,
        sheetData,
        labelsMap
      );
      resolve(targetThreads);
    } catch (err) {
      reject(err);
    }
  });
};

// filter target threads
function compareInputData(actualThreads, emailArr, labels) {
  // filter by people
  const byPeople = emailArr.map(item => {
    return actualThreads.filter(thread => thread.people.includes(item));
  });

  // construct labels ids
  const targetLabelsIds = labels.map(label => label.id);

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
          .map(label => labels.find(dbLab => dbLab.id === label).name)
      }));
  });
  return byLabels;
}

// get labels map
function getAccountsLabels() {
  return new Promise((resolve, reject) => {
    axios
      .get("/labels/target-labels-map")
      .then(res => resolve(res.data))
      .catch(err => reject(err));
  });
}
