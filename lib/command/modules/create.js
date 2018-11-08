var logger = require('../../utils/logger')
var reader = require('../../utils/reader')

module.exports = {
  createMock: async (client, context) => {
    logger.info('easy mock create mock')
    var inputFields = ['project_id', 'url', 'description', 'method', 'mode']
    var inputData = await reader.readProperties(inputFields, {
      'method': 'get',
    })

    for (var field of inputFields) {
      if (!inputData[field]) {
        throw new Error(`Missing ${field}`)
      }
    }

    var createResponse = await client.createMock(inputData)
    logger.info(createResponse, '\n')
  },
}
