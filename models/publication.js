const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const dataTables = require('mongoose-datatables')

const publicationSchema = new Schema({
  uuid: { type: String, default: v4 },
  titulo: { type: String },
  tipoPublicacion: { type: String },
  pais: { type: String },
  estado: { type: String },
  ciudad: { type: String },
  idioma: { type: String },
  frecuencia: { type: String },
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
    tipoPublicacion: this.tipoPublicacion,
    pais: this.pais,
    estado: this.estado,
    ciudad: this.ciudad,
    idioma: this.idioma,
    frecuencia: this.frecuencia,
    fechaInicio: this.fechaInicio,
    fechaFinalizo: this.fechaFinalizo
  }
}

publicationSchema.methods.toAdmin = function () {
  return {
    _id: this._id,
    titulo: this.titulo,
    tipoPublicacion: this.tipoPublicacion,
    pais: this.pais,
    estado: this.estado,
    ciudad: this.ciudad,
    idioma: this.idioma,
    frecuencia: this.frecuencia,
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
