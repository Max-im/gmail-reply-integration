import axios from "axios";

// get all threads from db
export const getDbThreads = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("/integration/get-db-threads")
      .then(res => resolve(res.data))
      .catch(err => reject(err));
  });
};
