const Route = require('lib/router/route');
const request = require('superagent');
const sharp = require('sharp');
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
    );
    
    const image = await sharp().png();
    ctx.body = reqImage.pipe(image);
  },
});
