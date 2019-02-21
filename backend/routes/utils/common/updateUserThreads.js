const asyncLoop = require("node-async-loop");
const getThreadDataById = require("../gmail/getThreadDataById");
const Thread = require("../../../model/Threads");

module.exports = (result, userLabels, account) => {
  return new Promise(resolve => {
    asyncLoop(
      result,
      async (id, nextId) => {
        // retrieve thread data
        const options = { id, userLabels, email: account.email };
        const threadData = await getThreadDataById(options);

        // check if the thread in db
        const theThread = await Thread.findOne({ threadId: id });

        // if there is new thread -
        if (theThread) {
          await Thread.findOneAndDelete({ _id: theThread._id });
        }

        // save new thread
        const newThread = new Thread(threadData);
        await newThread.save();
        console.log("saved or updated");
        nextId();
      },
      () => resolve()
    );
  });
};
