const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { v4 } = require('uuid');
const dataTables = require('mongoose-datatables');

const publicationIssueSchema = new Schema(
  {
    uuid: { type: String, default: v4 },
    publicacion_id: { type: Schema.Types.ObjectId, ref: 'Publication' },
    publicacionTitulo: { type: String },
    tipoAcceso: { type: Boolean },
    primerPaginaDelDia_id: { type: Schema.Types.ObjectId, ref: 'Page' },
    paginaFecha: { type: Date },
    mes: { type: Number },
    dia: { type: Number },
    anio: { type: Number },
  },
  {
    timestamps: true, 
  },
);

publicationIssueSchema.methods.toPublic = function() {
  return {
    _id: this._id,
    publicacion_id: this.publicacion_id,
    publicacionTitulo: this.publicacionTitulo,
    tipoAcceso: this.tipoAcceso,
    primerPaginaDelDia_id: this.primerPaginaDelDia_id,
    paginaFecha: this.paginaFecha,
    mes: this.mes,
    dia: this.dia,
    anio: this.anio,
  };
};

publicationIssueSchema.methods.toAdmin = function() {
  return {
    _id: this._id,
    publicacion_id: this.publicacion_id,
    publicacionTitulo: this.publicacionTitulo,
    tipoAcceso: this.tipoAcceso,
    primerPaginaDelDia_id: this.primerPaginaDelDia_id,
    paginaFecha: this.paginaFecha,
    mes: this.mes,
    dia: this.dia,
    anio: this.anio,
  };
};

publicationIssueSchema.plugin(dataTables, {
  formatters: {
    toAdmin: (page) => page.toAdmin(),
    toPublic: (page) => page.toPublic(),
  },
});

module.exports = mongoose.model('PublicationIssue', publicationIssueSchema);
