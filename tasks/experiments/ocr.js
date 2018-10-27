// node tasks/run-cron --cronName
require('../../config')
const assert = require('assert')
const path = require('path')
const Tesseract = require('tesseract.js')

const Task = require('lib/task')

const task = new Task(async function (argv) {
  const config = {
    lang: 'spa',
    oem: 1,
    psm: 3
  }

  return Tesseract.recognize(path.resolve(__dirname, 'test.png'), config)
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}
