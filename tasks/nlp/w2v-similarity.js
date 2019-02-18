// node tasks/nlp/w2v-similarity --model 1722 --word filosofia --limit 10
require('../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const assert = require('assert')
const path = require('path')
const { promisify } = require('util')
const w2v = require('word2vec')

w2v.loadModelAsync = promisify(w2v.loadModel)

const task = new Task(async function ({
  model,
  limit,
  word
}) {
  assert(model, 'model is required')
  assert(word, 'word is required')

  const preTrainedModel = await w2v.loadModelAsync(path.resolve(__dirname, `./models/${model}`))
  return preTrainedModel.mostSimilar(word, limit || 10)
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}
