#!/usr/bin/env node

var path = require('path')
var fs = require('fs')
var EasyMockClient = require('./')
var StorageLoader = require('./command/loader')
var CommandCli = require('./command/cli')

var tempPath = path.join(__dirname, '../temp/storage.tmp')

EasyMockClient.Instance = function (options) {
  var clientStorage = new StorageLoader(tempPath)

  var client = null
  if (clientStorage.isConnected()) {
    client = new EasyMockClient(clientStorage.loadConfig())
    client.load(clientStorage.loadSession())
  } else {
    client = new EasyMockClient(options)
    client.connect().then(function (response) {
      clientStorage.saveSession(client.config, client.session)
    })
  }

  return client
}

async function main() {
  var appPath = path.join(__dirname, '../app.json')
  var appConfig = require(appPath)
  var client = EasyMockClient.Instance(appConfig['easy-mock'])

  var commandCli = new CommandCli(process.argv)
  var commander = commandCli.getCommand()
  if (!commander) {
    console.log('找不到命令')
  } else if (commander.type === 'project') {
    client.listProjects().then(result => {
      console.log(result)
    })
  }
}

main().catch(err => {
  console.error(err)
  process.exit(2)
})
