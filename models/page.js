const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { v4 } = require('uuid');
const dataTables = require('mongoose-datatables');
const mongoosastic = require('mongoosastic');

const pageSchema = new Schema(
  {
    uuid: { type: String, default: v4 },
    publicacion_id: { type: Schema.Types.ObjectId, ref: 'Publication' },
    titulo: { type: String, es_indexed: true },
    ocr: { type: String, es_indexed: true },
    pais: { type: String },
    estado: { type: String },
    ciudad: { type: String },
    tipoPublicacion: { type: String },
    idioma: { type: String },
    pagina: { type: Number },
    rutaImagen: { type: String },
    rutaXML: { type: String },
    frecuencia: { type: String },
    fecha: { type: Date },
  },
  {
    timestamps: true,
    collection: 'pagina',
  },
);

pageSchema.methods.toPublic = function() {
  return {
    _id: this._id,
    publicacion_id: this.publicacion_id,
    titulo: this.titulo,
    ocr: this.ocr,
    pais: this.pais,
    estado: this.estado,
    ciudad: this.ciudad,
    fecha: this.fecha,
    idioma: this.idioma,
    pagina: this.pagina,
    frecuencia: this.frecuencia,
    tipoPublicacion: this.tipoPublicacion,
    rutaImagen: this.rutaImagen,
    rutaXML: this.rutaXML,
    paginaAnterior_id: this.paginaAnterior_id,
    paginaSiguiente_id: this.paginaSiguiente_id,
  };
};

pageSchema.methods.toAdmin = function() {
  return {
    _id: this._id,
    publicacion_id: this.publicacion_id,
    titulo: this.titulo,
    ocr: this.ocr,
    pais: this.pais,
    estado: this.estado,
    ciudad: this.ciudad,
    fecha: this.fecha,
    idioma: this.idioma,
    pagina: this.pagina,
    frecuencia: this.frecuencia,
    tipoPublicacion: this.tipoPublicacion,
    rutaImagen: this.rutaImagen,
    rutaXML: this.rutaXML,
    paginaAnterior_id: this.paginaAnterior_id,
    paginaSiguiente_id: this.paginaSiguiente_id,
  };
};

pageSchema.plugin(dataTables, {
  formatters: {
    toAdmin: (page) => page.toAdmin(),
    toPublic: (page) => page.toPublic(),
  },
});

pageSchema.plugin(mongoosastic, {
  hosts: ['localhost:9200'],
  bulk: {
    size: 10000,
    delay: 1000,
  },
});

module.exports = mongoose.model('Page', pageSchema);
