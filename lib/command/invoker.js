var BaseCommand = require('./command')
var logger = require('../utils/logger')

class CommandInvoker {
  constructor(rawArgv) {
    this.argv = rawArgv.slice(2)
    this.command = this.__parseCommand(this.argv)
  }

  __parseCommand(argvParams) {
    var command = new BaseCommand()
    if (argvParams[0] === 'project' && argvParams[1]) {
      command.register(argvParams, this.getSingleProject)
    } else if (argvParams[0] === 'project') {
      command.register(argvParams, this.listProjects)
    } else {
      command.register({}, function() {
        logger.error('找不到命令')
        return Promise.resolve(1)
      })
    }
    return command
  }

  getCommand() {
    return this.command
  }

  getSingleProject(client, context) {
    return client.getMock(context[1]).then(response => {
      logger.info(response)
    })
  }

  listProjects(client, context) {
    return client.listProjects().then(response => {
      logger.info(response)
    })
  }
}

module.exports = CommandInvoker
