
const Route = require('lib/router/route')
const QueryParams = require('lib/router/query-params')
const { promisify } = require('util')
const { Page } = require('models')
const _ = require('lodash')

const queryParams = new QueryParams()

Page.esSearchAsync = promisify(Page.esSearch)

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    const filters = await queryParams.toFilters(ctx.request.query)

    if (filters.search) {
      const results = await Page.esSearchAsync({
        from: ctx.request.query.start,
        size: ctx.request.query.limit || 20,
        query: {
          query_string: {
            query: filters.search
          }
        }
      }, {
        hydrate: true
      })

      ctx.body = {
        total: _.get(results, 'hits.total', 0),
        data: _.get(results, 'hits.hits', [])
      }

      return
    }

    const pages = await Page.dataTables({
      limit: ctx.request.query.limit || 20,
      skip: ctx.request.query.start,
      find: filters,
      formatter: 'toAdmin'
    })

    ctx.body = pages
  }
})
