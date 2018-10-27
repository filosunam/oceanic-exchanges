const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const dataTables = require('mongoose-datatables')

const pageSchema = new Schema({
  uuid: { type: String, default: v4 },
  publicacion_id: { type: Schema.Types.ObjectId, ref: 'Publication' },
  titulo: { type: String },
  ocr: { type: String }
}, {
  timestamps: true,
  collection: 'pagina'
})

pageSchema.methods.toPublic = function () {
  return {
    uuid: this.uuid,
    publication: this.publicacion_id,
    ocr: this.ocr
  }
}

pageSchema.methods.toAdmin = function () {
  return {
    uuid: this.uuid,
    publication: this.publicacion_id,
    ocr: this.ocr
  }
}

pageSchema.plugin(dataTables, {
  formatters: {
    toAdmin: (page) => page.toAdmin(),
    toPublic: (page) => page.toPublic()
  }
})

pageSchema.index({ name: 1 })

module.exports = mongoose.model('Page', pageSchema)
