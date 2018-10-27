
const Route = require('lib/router/route')
const { Publication } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    const data = {
      publication: {
        country: await Publication.distinct('pais'),
        city: await Publication.distinct('ciudad'),
        state: await Publication.distinct('estado'),
        language: await Publication.distinct('idioma'),
        frequency: await Publication.distinct('frecuencia'),
        publicationType: await Publication.distinct('tipoPublicacion')
      }
    }

    ctx.body = {
      data
    }
  }
})
