var readline = require('readline')
var colors = require('colors/safe')

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

async function readProperties(inputFields, defaultData) {
  var inputData = Object.assign({}, defaultData)

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

  return inputData
}

module.exports = {
  readlinePromise,
  readProperties,
}
