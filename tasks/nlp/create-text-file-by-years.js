// node tasks/nlp/create-text-file-by-year --fromYear 1722 --toYear 2020

require('../../config');
require('lib/databases/mongo');

const Task = require('lib/task');
const createTextFile = require('tasks/nlp/create-text-file');

const task = new Task(async function(argv) {
  const { fromYear, toYear } = argv;

  const textFiles = [];
  const errored = [];

  const intervals = [];

  // building blocks
  for (let ii = fromYear; ii < toYear; ) {
    intervals.push([ii, ii + 4]);
    ii += 4;
  }

  // create file inputs
  for (let interval of intervals) {
    const [fromYearInterval, toYearInterval] = interval;

    try {
      const textFile = await createTextFile.run({
        fromYear: fromYearInterval,
        toYear: toYearInterval,
      });

      textFiles.push(textFile);
    } catch (e) {
      errored++;
    }
  }

  return {
    created: textFiles.length,
    errored,
  };
});

if (require.main === module) {
  task.setCliHandlers();
  task.run();
} else {
  module.exports = task;
}
