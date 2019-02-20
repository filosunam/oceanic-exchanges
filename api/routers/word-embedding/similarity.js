const lov = require('lov');
const Route = require('lib/router/route');
const w2v = require('word2vec');
const w2vSimilarity = require('tasks/nlp/w2v-similarity');
const fs = require('fs');
const path = require('path');
const { modelsPath } = require('config/w2v');
const modelFiles = fs.readdirSync(modelsPath);

const models = [];
for (let modelFile of modelFiles) {
  if (path.extname(modelFile) === '.bin') {
    w2v.loadModel(`${modelsPath}/${modelFile}`, function(err, model) {
      if (!err) {
        models.push({
          name: modelFile.replace('.bin', ''),
          model,
        });
      }
    });
  }
}

module.exports = new Route({
  method: 'get',
  path: '/similarity',
  handler: async function(ctx) {
    const { word } = ctx.query;
    ctx.assert(word, 'word is required');

    let similarities = {};

    models.sort((a, b) => a.name.localeCompare(b.name));

    for (let { name: modelName, model } of models) {
      let mostSimilar = model.mostSimilar(word, 10) || [];
      if (mostSimilar.length) {
        similarities[modelName] = mostSimilar;
      }
    }

    ctx.body = {
      similarities,
    };
  },
});
