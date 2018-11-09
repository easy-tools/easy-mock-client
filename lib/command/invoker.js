var BaseCommand = require('./command')
var logger = require('../utils/logger')
var generalUtils = require('../utils/general')
var colors = require('colors/safe')
var projectModule = require('./modules/project')

class CommandInvoker {
  constructor(rawArgv) {
    this.argv = rawArgv.slice(2)
    this.command = this.__parseCommand(this.argv)
  }

  __parseCommand(argvParams) {
    var command = new BaseCommand()
    if (argvParams[0] === 'help') {
      command.register(argvParams, this.help)
    } else if (argvParams[0] === 'ls' && argvParams[1]) {
      command.register(argvParams, this.getSingleProject)
    } else if (argvParams[0] === 'ls') {
      command.register(argvParams, this.listProjects)
    } else if (argvParams[0] === 'inspect' && argvParams[1] && argvParams[2]) {
      command.register(argvParams, this.showMockData)
    } else if (argvParams[0] === 'create' && argvParams[1] === 'mock') {
      command.register(argvParams, projectModule.createMock)
    } else {
      command.register({}, function () {
        logger.error('找不到命令')
        return Promise.resolve(1)
      })
    }
    return command
  }

  getCommand() {
    return this.command
  }

  help() {
    logger.info(`> Read more here: https://github.com/easy-tools/easy-mock-client`)
    logger.info('', 'easy-mock-cli <command>', '\n')
    logger.info('', colors.gray('Commands:'))

    const commands = [{
      name: 'ls',
      options: [],
      description: 'List all projects',
      example: '$ easy-mock-cli ls',
    }, {
      name: 'ls',
      options: ['projectId'],
      description: 'Display single project with mocks',
      example: '$ easy-mock-cli ls project1',
    }, {
      name: 'inspect',
      options: ['projectId', 'mockId'],
      description: 'Display single project with mocks',
      example: '$ easy-mock-cli inspect project1 mock1',
    }, {
      name: 'create mock',
      options: [],
      description: 'Create mock api',
      example: '$ easy-mock-cli create mock',
    }]
    const maxLength = []
    const contentList = []
    for (let comm of commands) {
      let content = [comm['name']]
      content.push(comm['options'].map(item => `[${item}]`).join(' '))
      content.push(comm['description'])

      for (let i in content) {
        if (!maxLength[i] || maxLength[i] < content[i].length) {
          maxLength[i] = content[i].length
        }
      }

      contentList.push(content)
    }

    for (let content of contentList) {
      const printContent = content.map((item, index) => {
        return generalUtils.paddingRight(item, maxLength[index], ' ')
      })

      logger.info('   ', printContent.join('  '))
    }
    logger.info('')
    logger.info('', colors.gray('Examples:'), '\n')
    for (let comm of commands) {
      logger.info('', colors.gray('-'), comm.description, '\n')
      logger.info('   ', colors.cyan(comm.example), '\n')
    }
    logger.info('')
    return Promise.resolve(commands)
  }

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
  }

  getSingleProject(client, context) {
    var startTimestamp = Date.now()
    return client.getMock(context[1]).then(response => {
      var finishTimeStamp = Date.now()
      var runTime = finishTimeStamp - startTimestamp

      var projectData = response.data
      logger.info(`> Fetched Project "${projectData.project._id}" ${projectData.project.name}`, colors.gray(`[${runTime}s]`), '\n')
      logger.info('   Project Information')
      logger.info('   ', colors.gray(generalUtils.paddingRight('user', 12, ' ')), projectData.project.user.name)
      var infoFields = ['_id', 'name', 'url', 'description']
      for (var key of infoFields) {
        logger.info('   ', colors.gray(generalUtils.paddingRight(key, 12, ' ')), projectData.project[key])
      }
      logger.info('\n', '  Mocks')
      var projectMocks = projectData.mocks
      for (var mockData of projectMocks) {
        logger.info('   ', colors.gray(mockData._id), mockData.url, colors.green(`(${mockData.method})`), mockData.description)
      }
      logger.info('')
    })
  }

  listProjects(client, context) {
    var startTimestamp = Date.now()
    return client.listProjects().then(response => {
      var finishTimeStamp = Date.now()
      var runTime = finishTimeStamp - startTimestamp

      var projectList = response.data
      logger.info('>', `${projectList.length} total projects found`, colors.gray(`[${runTime}ms]`))
      logger.info('> To list mocks for an project run `' + colors.cyan('easy-mock-cli ls [app]') + '`', '\n')

      var itemList = []
      var maxLength = []
      for (var project of projectList) {
        var item = [project._id, project.name, project.url, project.description.substr(0, 15) + '...']
        itemList.push(item)
        for (var i in item) {
          var meta = item[i]
          if (meta.length > maxLength[i] || !maxLength[i]) {
            maxLength[i] = meta.length
          }
        }
      }

      var titleLine = ['_id', 'name', 'url', 'description'].map((word, index) => {
        return word.padEnd(maxLength[index], ' ')
      })

      logger.info(' ', colors.gray(titleLine.join('  ')))
      for (var element of itemList) {
        var target = element.map((word, index) => {
          return generalUtils.paddingRight(word, maxLength[index], ' ')
        }).join('  ')
        logger.info(' ', target)
      }

      logger.info('\n')
    })
  }
}

module.exports = CommandInvoker
