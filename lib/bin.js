#!/usr/bin/env node

var colors = require('colors/safe')
var path = require('path')
var fs = require('fs')
var EasyMockClient = require('./')
var StorageLoader = require('./command/loader')
var CommandInvoker = require('./command/invoker')

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
  var appPath = path.resolve('./app.json')
  if (!fs.existsSync(appPath)) {
    console.log(colors.red('找不到配置文件 app.json'))
    return Promise.resolve(1)
  }

  var appConfig = require(appPath)
  var client = EasyMockClient.Instance(appConfig['easy-mock'])

  var commandCli = new CommandInvoker(process.argv)
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
