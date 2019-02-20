// node tasks/nlp/train-models --inputPath ./tmp/years --outputPath ./tmp/models
require('../../config');

const Task = require('lib/task');
const fs = require('fs');
const assert = require('assert');
const path = require('path');
const { execSync } = require('child_process');

const task = new Task(async function(argv) {
  const { inputPath } = argv;
  const { outputPath } = argv;

  assert(inputPath, 'inputPath is required');
  assert(outputPath, 'outputPath is required');

  const trained = 0;
  const errored = 0;

  const files = fs.readdirSync(inputPath);
  const word2vec = path.resolve(__dirname, '../../lib/word2vec/word2vec');

  for (let file of files) {
    if (path.extname(file) === '.txt') {
      const modelFileName = file.replace('.txt', '.bin');

      // shiCo suggests:
      //  - size: 300
      //  - window: 5
      //  - negative: 0 (disabled, because hierarchical softmax is enabled)
      //  - hs: 1 (enabled, then “negative” param should be disabled)
      //  - cbow: 0 (disabled in order to using skip-grams)
      //  - min-count: 5 (minimum word frequency)

      execSync(
        `
          ${word2vec} \
          -train ${inputPath}/${file} \
          -output ${outputPath}/${modelFileName} \
          -binary 1 \
          -size ${argv.size || 100} \
          -window ${argv.window || 5} \
          -sample ${argv.sample || 1e-3} \
          -hs ${argv.sample || 0} \
          -cbow ${argv.cbow || 1} \
          -negative ${argv.negative || 5} \
          -iter ${argv.iter || 5} \
          -min-count ${argv['min-count'] || 5}
        `,
        {
          stdio: 'inherit',
        },
      );
    }
  }

  return {
    trained,
    errored,
  };
});

if (require.main === module) {
  task.setCliHandlers();
  task.run();
} else {
  module.exports = task;
}
