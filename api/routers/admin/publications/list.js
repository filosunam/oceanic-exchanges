
const Route = require('lib/router/route')
const QueryParams = require('lib/router/query-params')

const { Publication } = require('models')

const queryParams = new QueryParams()

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    const filters = await queryParams.toFilters(ctx.request.query)

    if (filters.tipoAcceso) {
      filters.tipoAcceso = filters.tipoAcceso === 'true'
    }

    const publications = await Publication.dataTables({
      limit: ctx.request.query.limit || 20,
      skip: ctx.request.query.start,
      find: filters,
      formatter: 'toAdmin'
    })

    ctx.body = publications
  }
})
