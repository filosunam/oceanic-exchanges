const Route = require('lib/router/route');
const QueryParams = require('lib/router/query-params');
const moment = require('moment');
const { Publication, PublicationIssue, Page } = require('models');

const queryParams = new QueryParams();

module.exports = new Route({
  method: 'get',
  path: '/:id/numbers',
  handler: async function(ctx) {
    const { id: publicationId } = ctx.params;
    const filters = await queryParams.toFilters(ctx.request.query);

    const publication = await Publication.findOne({ _id: publicationId });
    ctx.assert(publication, 404, 'Publication not found');

    const publicationIssues = await Page.dataTables({
      limit: ctx.request.query.limit || 20,
      skip: ctx.request.query.start,
      find: { pagina: 1, publicacion_id: publication._id },
      sort: { pagina: 1, publicacion_id: 1 },
      formatter: 'toAdmin',
    });

    publicationIssues.data = await Promise.all(
      publicationIssues.data.map(async (publicationIssue) => {
        publicationIssue.pageCount = await Page.count({
          publicacion_id: publication._id,
          fecha: {
            $gt: moment(publicationIssue.fecha)
              .startOf('day')
              .toDate(),
            $lt: moment(publicationIssue.fecha)
              .endOf('day')
              .toDate(),
          },
        });

        return publicationIssue;
      }),
    );

    ctx.body = publicationIssues;
  },
});
