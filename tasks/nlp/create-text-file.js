// node tasks/nlp/create-file-text --file ./tmp/1891.txt
//
// Should be used to generate a large text file of phrases
// based on "paginas" collection in order to do analysis
// using topic modelling, lda, word2vec, etcetera.
//
// You can use the following params:
//
// - limit (to set a limit of pages)
// - file (to define a path of output file, default is current timestamp)
// - fromYear (to get pages based on a starting year)
// - toYear (to get pages based on a finishing year)
//
// NOTE: `fromYear` and `toYear` are useful params to create
// pre-trained models by period of time.

require('../../config');
require('lib/databases/mongo');

const Task = require('lib/task');
const { Page } = require('models');
const fs = require('fs');
const ora = require('ora');
const moment = require('moment');

const task = new Task(async function(argv) {
  const { limit, fromYear, toYear } = argv;

  let filename = Date.now();

  if (fromYear && toYear) {
    filename = `${fromYear}_${toYear}`;
  } else {
    filename = `${fromYear || toYear}`;
  }

  const file = argv.file || `./tmp/years/${filename}.txt`;

  // Creating a write stream to store data
  const stream = fs.createWriteStream(file, { flags: 'w' });

  const pageQuery = {};

  if (fromYear) {
    pageQuery.fecha = pageQuery.fecha || {};
    pageQuery.fecha.$gte = moment(fromYear, 'YYYY')
      .startOf('year')
      .toDate();
  }

  if (toYear) {
    pageQuery.fecha = pageQuery.fecha || {};
    pageQuery.fecha.$lte = moment(toYear, 'YYYY')
      .endOf('year')
      .toDate();
  }

  // We're using database cursors to avoid memory exceeds
  const pages = await Page.find(pageQuery)
    .limit(limit || 0)
    .cursor();
  const count = await Page.count(pageQuery).limit(limit || 0);

  const spinner = ora('Creating file... 0%').start();
  spinner.color = 'yellow';
  spinner.start();

  let i = 0;

  // Loop in page collection
  for (let page = await pages.next(); page != null; page = await pages.next()) {
    const ocr = page.ocr || '';
    const words = ocr.match(/\b[^\d\W]+\b/g) || [];

    if (words.length) {
      const phrase = words.join(' ');
      stream.write(`${phrase}\n`);
      i++;
    }

    const percent = (i * 100) / count;
    spinner.text = 'Creating file... ' + percent.toFixed(2) + '%';
  }

  spinner.text = 'Finished 100%';
  spinner.succeed();

  return file;
});

if (require.main === module) {
  task.setCliHandlers();
  task.run();
} else {
  module.exports = task;
}
