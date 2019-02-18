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

      execSync(
        `
          ${word2vec} \
          -train ${inputPath}/${file} \
          -output ${outputPath}/${modelFileName} \
          -binary 1 \
          -size 300 \
          -window 5 \
          -hs 1 \
          -cbow 0 \
          -negative 0 \
          -min-count 5
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
