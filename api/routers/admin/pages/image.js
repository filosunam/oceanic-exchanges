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

    const { body: inputImageBuffer } = await request.get(
      `${server.adminHost}${server.adminPrefix}/acervo/${page.rutaImagen}`,
    );
    ctx.assert(inputImageBuffer, 404, 'Image not found');

    const image = await sharp(inputImageBuffer).png();
    const imageBuffer = await image.toBuffer();

    ctx.body = {
      data: 'data:image/png;base64,' + imageBuffer.toString('base64'),
    };
  },
});
