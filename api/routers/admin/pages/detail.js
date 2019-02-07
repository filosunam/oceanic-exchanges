const Route = require('lib/router/route')
const { Page } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/:id',
  handler: async function (ctx) {
    const { id: _id } = ctx.params

    const page = await Page.findOne({ _id })
    ctx.assert(page, 404, 'Page not found')

    ctx.body = {
      data: page.toAdmin()
    }
  }
})
