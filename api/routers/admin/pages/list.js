
const Route = require('lib/router/route')
const QueryParams = require('lib/router/query-params')

const { Page } = require('models')

const queryParams = new QueryParams()

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    const filters = await queryParams.toFilters(ctx.request.query)

    const pages = await Page.dataTables({
      limit: ctx.request.query.limit || 20,
      skip: ctx.request.query.start,
      // find: {isDeleted: { $ne: true }, ...filters},
      // sort: ctx.request.query.sort || '-createdAt',
      format: 'toAdmin'
    })

    ctx.body = pages
  }
})