const Route = require('lib/router/route');
const { Publication } = require('models');

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function(ctx) {
    const initialYears = await Publication.aggregate([
      {
        $project: {
          year: { $year: '$fechaInicio' },
        },
      },
      {
        $group: {
          _id: null,
          distinctYears: { $addToSet: { label: '$year', value: '$year' } },
        },
      },
    ]);
    initialYears[0].distinctYears.sort((a, b) => a.value - b.value);

    const lastYears = await Publication.aggregate([
      {
        $project: {
          year: { $year: '$fechaFinalizo' },
        },
      },
      {
        $sort: {
          year: -1,
        },
      },
      {
        $group: {
          _id: null,
          distinctYears: { $addToSet: { label: '$year', value: '$year' } },
        },
      },
    ]);
    lastYears[0].distinctYears.sort((a, b) => b.value - a.value);

    const data = {
      publication: {
        country: await Publication.distinct('pais'),
        city: await Publication.distinct('ciudad'),
        state: await Publication.distinct('estado'),
        language: await Publication.distinct('idioma'),
        frequency: await Publication.distinct('frecuencia'),
        publicationType: await Publication.distinct('tipoPublicacion'),
        initialYears: initialYears[0].distinctYears,
        lastYears: lastYears[0].distinctYears,
      },
    };

    ctx.body = {
      data,
    };
  },
});
