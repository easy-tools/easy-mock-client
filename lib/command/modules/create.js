var logger = require('../../utils/logger')
var generalUtils = require('../../utils/general')
var colors = require('colors/safe')

var readline = require('readline')

function readlinePromise(question) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question(question, (answer) => {
      // TODO: Log the answer in a database
      // console.log(`Thank you for your valuable feedback: ${answer}`)
      resolve(answer)

      rl.close()
    })
  })
}

module.exports = {
  createMock: async (client, context) => {
    logger.info('easy mock create mock')
    var inputFields = ['project_id', 'url', 'description', 'method', 'mode']
    var inputData = {
      'method': 'get',
    }

    for (var key of inputFields) {
      var question = [colors.gray('question'), key]
      if (inputData[key]) {
        question.push(`(${inputData[key]})`)
      }
      var input = await readlinePromise(question.join(' ') + ':')

      if (input) {
        inputData[key] = input
      }
    }

    for (var field of inputFields) {
      if (!inputData[field]) {
        throw new Error(`Missing ${field}`)
      }
    }

    var createResponse = await client.createMock(inputData)
    logger.info(createResponse, '\n')
  }
}
