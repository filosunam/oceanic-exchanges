const lov = require('lov');
const Route = require('lib/router/route');
const w2v = require('word2vec');
const w2vSimilarity = require('tasks/nlp/w2v-similarity');
const fs = require('fs');
const path = require('path');

const modelFiles = fs.readdirSync(
  path.resolve(__dirname, '../../../tasks/nlp/models'),
);
const models = [];
for (let modelFile of modelFiles) {
  w2v.loadModel(
    path.resolve(__dirname, `../../../tasks/nlp/models/${modelFile}`),
    function(err, model) {
      if (!err) {
        models.push({
          name: modelFile.replace('.bin', ''),
          model,
        });
      }
    },
  );
}

module.exports = new Route({
  method: 'get',
  path: '/similarity',
  handler: async function(ctx) {
    const { word } = ctx.query;
    ctx.assert(word, 'word is required');

    let similarities = {};

    for (let { name: modelName, model } of models) {
      similarities[modelName] = model.mostSimilar(word, 10) || [];
    }

    ctx.body = {
      similarities,
    };
  },
});
