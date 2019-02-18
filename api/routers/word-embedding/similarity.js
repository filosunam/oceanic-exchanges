const lov = require('lov');
const Route = require('lib/router/route');
const w2vSimilarity = require('tasks/nlp/w2v-similarity');

module.exports = new Route({
  method: 'post',
  path: '/similarity',
  validator: lov.object().keys({
    word: lov.string().required(),
    fromYear: lov.string().required(),
    toYear: lov.string().required(),
  }),
  handler: async function(ctx) {
    const { word, fromYear, toYear } = ctx.request.body;

    let similarityData = {};

    try {
      similarityData = await w2vSimilarity.run({
        word,
        model: `${fromYear}_${toYear}.bin`,
      });
    } catch (e) {
      console.log('ERROR =>', e);
    }

    ctx.body = {
      similarityData,
    };
  },
});
