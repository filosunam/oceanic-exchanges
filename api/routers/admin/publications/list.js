
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

    let search = {}
    if (filters.search) {
      search = {
        value: String(filters.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        fields: [
          'titulo'
        ]
      }
      delete filters.search
    }

    const publications = await Publication.dataTables({
      limit: ctx.request.query.limit || 20,
      search,
      skip: ctx.request.query.start,
      find: filters,
      formatter: 'toAdmin'
    })

    ctx.body = publications
  }
})
