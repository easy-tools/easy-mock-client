class CommandInvoker {
  constructor(rawArgv) {
    this.argv = rawArgv.slice(2)
    this.command = this.__parseCommand(this.argv)
  }

  __parseCommand(argvParams) {
    if (argvParams[0] === 'project') {
      return {
        type: 'project',
        params: argvParams.slice(1)
      }
    }
    return null
  }

  getCommand() {
    return this.command
  }
}

module.exports = CommandInvoker
