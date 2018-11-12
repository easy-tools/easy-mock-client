var colors = require('colors/safe')
var generalUtils = require('../../utils/general')
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
    return createResponse
  },
  showMockData(client, context) {
    var startTimestamp = Date.now()
    return client.getMock(context[1]).then(response => {
      var finishTimeStamp = Date.now()
      var runTime = finishTimeStamp - startTimestamp

      var projectData = response.data
      var projectMocks = projectData.mocks
      var mockMap = projectMocks.reduce((result, current) => {
        result[current._id] = current
        return result
      }, {})

      if (!mockMap[context[2]]) {
        logger.info(colors.red('> Error!'), `Failed to find Mock "${context[2]}" in ${projectData.project._id}[${projectData.project.name}]`)
        return
      }
      var mockData = mockMap[context[2]]

      logger.info(`> Fetched Mock "${mockData._id}"`, colors.gray(`[${runTime}s]`), '\n')
      logger.info('   Mock Information')
      var mockFields = ['method', '_id', 'url', 'description']
      for (var key of mockFields) {
        logger.info('   ', colors.gray(generalUtils.paddingRight(key, 12, ' ')), colors.yellow(mockData[key]))
      }
      logger.info('\n', '  Mode')
      logger.info('   ', mockData.mode)

      logger.info('\n', '  Parameters')
      logger.info('   ', mockData.parameters || 'null')

      logger.info('\n', '  Response Model')
      logger.info('   ', mockData.response_model || 'null')
      logger.info('')
    })
  },
  updateMock: async (client, context) => {
    const responseData = await client.getMock(context[2])

    const mockProject = responseData.data
    const mockId = context[3]
    const projectMocks = mockProject.mocks
    let existMock = null
    for (let currentMock of projectMocks) {
      if (currentMock._id === mockId) {
        existMock = currentMock
      }
    }

    if (!existMock) {
      throw new Error(`Mock is not exist`)
    }

    logger.info('>', `You will update mock [${existMock.url}]`)
    var inputFields = ['url', 'description', 'method', 'mode']
    var inputData = await reader.readProperties(inputFields, Object.assign({
      id: mockId,
    }, existMock))

    for (var field of inputFields) {
      if (!inputData[field]) {
        throw new Error(`Missing ${field}`)
      }
    }

    const isConfirm = await reader.readlinePromise(colors.red('> Are you sure?') + colors.gray(' [y/N] '))
    if (isConfirm.toLowerCase() !== 'y') {
      logger.info('>', 'Aborted')
      return
    }

    var updateResponse = await client.updateMock(inputData)
    logger.info(updateResponse, '\n')
    return updateResponse
  },
  createProject: async (client, context) => {
    logger.info('easy mock create project')
    var inputFields = ['description', 'url', 'name', 'group']
    var necessaryFields = ['description', 'name']
    var inputData = await reader.readProperties(inputFields, {
      members: [],
      swagger_url: '',
      id: '',
    })

    for (var field of inputFields) {
      if (!inputData[field] && necessaryFields.includes(field)) {
        throw new Error(`Missing ${field}`)
      }
    }

    var createResponse = await client.createProject(inputData)
    logger.info(createResponse, '\n')
    return createResponse
  },
}
