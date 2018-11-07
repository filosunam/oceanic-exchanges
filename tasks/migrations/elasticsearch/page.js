// node tasks/migrations/elasticsearch/page
require('../../../config')
require('lib/databases/mongo')
const ora = require('ora')
const { Page } = require('models')
const stream = Page.synchronize({})

const spinner = ora('Indexing... 0%').start()
spinner.color = 'yellow'
spinner.start()

let i = 0
let count = 0

stream.on('data', function (err, doc) {
  if (err) {
    return console.log('Failed =>', doc)
  }
  i++

  if (!count) {
    Page.count().exec(function (err, doc) {
      if (!err) {
        count = doc
      }
    })
  } else {
    const percent = Math.round(i * 100 / count)
    spinner.text = 'Indexing... ' + percent + '% (' + i + ')'
  }
})

stream.on('close', function () {
  console.log(count + ' documents have been indexed!')
  process.exit()
})

stream.on('error', function (err) {
  console.log('Error =>', err)
})
