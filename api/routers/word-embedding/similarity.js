const lov = require('lov');
const Route = require('lib/router/route');
const w2v = require('word2vec');
const w2vSimilarity = require('tasks/nlp/w2v-similarity');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { modelsPath } = require('config/w2v');
const modelFiles = fs.readdirSync(modelsPath);

w2v.loadModelAsync = promisify(w2v.loadModel);

const models = [];

async function loadModels() {
  for (let modelFile of modelFiles) {
    if (path.extname(modelFile) === '.bin') {
      const model = await w2v.loadModelAsync(`${modelsPath}/${modelFile}`);
      models.push({
        name: modelFile.replace('.bin', ''),
        model,
      });
      console.log('w2v model loaded =>', modelFile);
    }
  }
}

loadModels();

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
