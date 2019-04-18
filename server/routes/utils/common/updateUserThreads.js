const asyncLoop = require("node-async-loop");
const getThreadDataById = require("../gmail/getThreadDataById");
const Thread = require("../../../model/Threads");

module.exports = (threadIdArr, userLabels, account) => {
  return new Promise((resolve, reject) => {
    try {
      asyncLoop(
        threadIdArr,
        async (id, nextId) => {
          // retrieve thread data
          const options = { id, userLabels, email: account.email };
          const threadData = await getThreadDataById(options);
          if (!threadData) return nextId();

          // check if the thread in db
          const theThread = await Thread.findOne({ threadId: id });

          // if there is new thread -
          if (theThread)
            await Thread.findOneAndUpdate({ _id: theThread._id }, theThread);
          // save new thread
          else await Thread.create(threadData);

          nextId();
        },
        () => {
          resolve();
        }
      );
    } catch (err) {
      console.error("Error updating account", err);
      reject("Error updating account");
    }
  });
};
