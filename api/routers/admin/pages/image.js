const Route = require('lib/router/route');
const request = require('superagent');
const sharp = require('sharp');
const { Base64Encode } = require('base64-stream');
const { Page } = require('models');
const config = require('config')
const { server } = config;

module.exports = new Route({
  method: 'get',
  path: '/:id/image',
  handler: async function(ctx) {
    const { id: _id } = ctx.params;

    const page = await Page.findOne({ _id });
    ctx.assert(page, 404, 'Page not found');

    const reqImage = request.get(
      `${server.adminHost}${server.adminPrefix}/acervo/${page.rutaImagen}`
      // 'https://intercambiosoceanicos.iib.unam.mx/admin/acervo/558075be7d1e63c9fea1a3f3/1916/07/10/p0003.tif'
    );
    
    const image = sharp().png({
      compressionLevel: 9
    });
    ctx.body = reqImage.pipe(image).pipe(new Base64Encode());
    ctx.set('Content-Type', 'text/plain');
  },
});
