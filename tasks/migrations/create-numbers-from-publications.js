// node tasks/create-numbers-from-publications
require('../../config');
require('lib/databases/mongo');
const assert = require('assert');
const ora = require('ora');
const moment = require('moment');
const { Page, PublicationIssue } = require('models');
const Task = require('lib/task');

const task = new Task(async function(argv) {
  const pages = Page.find({ pagina: 1 }).cursor();
  const count = await Page.count({ pagina: 1 });

  const spinner = ora(`Upserting ${count} publishing issues... 0%`).start();
  spinner.color = 'yellow';
  spinner.start();

  let i = 0;

  for (let page = await pages.next(); page != null; page = await pages.next()) {
    await PublicationIssue.update(
      {
        publicacion_id: page.publicacion_id,
        mes: moment(page.fecha).format('MM'),
        dia: moment(page.fecha).format('DD'),
        anio: moment(page.fecha).format('YYYY'),
      },
      {
        $set: {
          publicacionTitulo: page.titulo,
          primerPaginaDelDia_id: page._id,
          paginaFecha: page.fecha,
        },
      },
      {
        upsert: true,
      },
    );

    i++;

    const percent = (i * 100) / count;
    spinner.text = `Upserting ${count -
      i} publishing issues... ${percent.toFixed(2)}%`;
  }

  spinner.text = 'Finished 100%';
  spinner.succeed();
}, 1000);

if (require.main === module) {
  task.setCliHandlers();
  task.run();
} else {
  module.exports = task;
}
