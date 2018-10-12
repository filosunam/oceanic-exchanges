const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const dataTables = require('mongoose-datatables')

const publicationSchema = new Schema({
  uuid: { type: String, default: v4 },
  titulo: { type: String },
  pais: { type: String },
  fechaInicio: { type: Date },
  fechaFinalizo: { type: Date }
}, {
  timestamps: true,
  collection: 'publicacion'
})

publicationSchema.methods.toPublic = function () {
  return {
    _id: this._id,
    titulo: this.titulo,
    pais: this.pais,
    fechaInicio: this.fechaInicio,
    fechaFinalizo: this.fechaFinalizo
  }
}

publicationSchema.methods.toAdmin = function () {
  return {
    _id: this._id,
    titulo: this.titulo,
    pais: this.pais,
    fechaInicio: this.fechaInicio,
    fechaFinalizo: this.fechaFinalizo
  }
}

publicationSchema.plugin(dataTables, {
  formatters: {
    toAdmin: (publication) => publication.toAdmin(),
    toPublic: (publication) => publication.toPublic()
  }
})

module.exports = mongoose.model('Publication', publicationSchema)
