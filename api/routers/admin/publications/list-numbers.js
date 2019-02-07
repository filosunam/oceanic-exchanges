
const Route = require('lib/router/route')
const QueryParams = require('lib/router/query-params')
const moment = require('moment')
const { Publication, PublicationNumber, Page } = require('models')

const queryParams = new QueryParams()

module.exports = new Route({
  method: 'get',
  path: '/:id/numbers',
  handler: async function (ctx) {
    const { id: publicationId } = ctx.params
    const filters = await queryParams.toFilters(ctx.request.query)

    const publication = await Publication.findOne({ _id: publicationId })
    ctx.assert(publication, 404, 'Publication not found')

    filters.publicacion_id = publication._id

    if (filters.tipoAcceso) {
      filters.tipoAcceso = filters.tipoAcceso === 'true'
    }

    const publicationNumbers = await PublicationNumber.dataTables({
      limit: ctx.request.query.limit || 20,
      skip: ctx.request.query.start,
      find: filters,
      formatter: 'toAdmin'
    })

    publicationNumbers.data = await Promise.all(
      publicationNumbers.data.map(async publicationNumber => {
        publicationNumber.pageCount = await Page.count({
          fecha: {
            $gt: moment(publicationNumber.paginaFecha).startOf('day').toDate(),
            $lt: moment(publicationNumber.paginaFecha).endOf('day').toDate()
          }
        })

        return publicationNumber
      })
    )

    ctx.body = publicationNumbers
  }
})
