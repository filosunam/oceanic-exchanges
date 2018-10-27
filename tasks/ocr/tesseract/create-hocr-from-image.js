// node tasks/ocr/tesseract/create-hocr-from-image --image /path/to/image --out /path/to/output
require('../../../config')
require('lib/databases/mongo')
const assert = require('assert')
const Task = require('lib/task')

const util = require('util')
const exec = util.promisify(require('child_process').exec)

const task = new Task(async (argv) => {
  assert(argv.image, 'image is required')
  assert(argv.out, 'out is required')

  const result = await exec(`
    tesseract ${argv.image} ${argv.out} \
    --oem 1 \
    --psm 3 \
    -c 'tessedit_create_hocr=1' \
    -l 'spa+spa_old+script/Latin'
  `)
  return result
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}
