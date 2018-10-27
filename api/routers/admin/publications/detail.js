const Route = require('lib/router/route')
const { Publication } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/:id',
  handler: async function (ctx) {
    const { id } = ctx.params

    const publication = await Publication.findOne({ _id: id })
    ctx.assert(publication, 404, 'Publication not found')

    ctx.body = {
      data: publication.toAdmin()
    }
  }
})
