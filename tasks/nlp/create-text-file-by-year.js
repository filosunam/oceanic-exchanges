// node tasks/nlp/create-text-file-by-year --fromYear 1722 --toYear 2020

require('../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const createTextFile = require('tasks/nlp/create-text-file')

const task = new Task(async function (argv) {
  const { fromYear, toYear } = argv

  let textFiles = []
  let errored = 0

  for (let year = fromYear; toYear >= year; year++) {
    try {
      const textFile = await createTextFile.run({
        fromYear: year,
        toYear: year,
        file: `${__dirname}/years/${year}.txt`
      })

      textFiles.push(textFile)
    } catch (e) {
      errored++
      console.log('Error =>', e)
    }
  }

  return {
    created: textFiles.length,
    errored
  }
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}
