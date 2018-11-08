function CommandCli(rawArgv) {
  this.argv = rawArgv.slice(2)
  this.command = this.__parseCommand(this.argv)
}

CommandCli.prototype.__parseCommand = function (argvParams) {
  if (argvParams[0] === 'project') {
    return {
      type: 'project',
      params: argvParams.slice(1)
    }
  }
  return null
}

CommandCli.prototype.getCommand = function () {
  return this.command
}

module.exports = CommandCli
