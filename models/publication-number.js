const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const dataTables = require('mongoose-datatables')

const publicationNumberSchema = new Schema({
  uuid: { type: String, default: v4 },
  publicacion_id: { type: Schema.Types.ObjectId, ref: 'Publication' },
  primerPaginaDelDia_id: { type: Schema.Types.ObjectId, ref: 'Page' },
  paginaFecha: { type: Date }
}, {
  timestamps: true,
  collection: 'listaPagina'
})

publicationNumberSchema.methods.toPublic = function () {
  return {
    _id: this._id,
    publicacion_id: this.publicacion_id,
    primerPaginaDelDia_id: this.primerPaginaDelDia_id,
    paginaFecha: this.paginaFecha
  }
}

publicationNumberSchema.methods.toAdmin = function () {
  return {
    _id: this._id,
    publicacion_id: this.publicacion_id,
    primerPaginaDelDia_id: this.primerPaginaDelDia_id,
    paginaFecha: this.paginaFecha
  }
}

publicationNumberSchema.plugin(dataTables, {
  formatters: {
    toAdmin: (page) => page.toAdmin(),
    toPublic: (page) => page.toPublic()
  }
})

module.exports = mongoose.model('PublicationNumber', publicationNumberSchema)
