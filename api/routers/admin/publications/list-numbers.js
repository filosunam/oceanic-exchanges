
const Route = require('lib/router/route')
const QueryParams = require('lib/router/query-params')

const { Page, Publication } = require('models')

const queryParams = new QueryParams()

module.exports = new Route({
  method: 'get',
  path: '/:id/numbers',
  handler: async function (ctx) {
    const { id } = ctx.params
    const query = ctx.request.query
    const filters = await queryParams.toFilters(query)

    const publication = await Publication.findOne({ _id: id })
    filters.publicacion_id = publication._id

    const pipelines = [{
      $match: filters
    }, {
      $group: {
        _id: {
          day: {$dayOfMonth: '$fecha'},
          month: {$month: '$fecha'},
          year: {$year: '$fecha'}
        },
        pages: { $addToSet: '$$ROOT' },
        count: {$sum: 1}
      }
    }, {
      $skip: parseInt(query.start, 10) || 0
    }, {
      $limit: parseInt(query.limit, 10) || 20
    }]

    const numbers = await Page.aggregate(pipelines)
    const count = await Page.aggregate(pipelines.splice(0, 2))

    ctx.body = {
      total: count.length,
      data: numbers
    }
  }
})
