var path = require('path')
var fs = require('fs')
var StorageLoader = require('./loader')
var EasyMockClient = require('./')

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

  client.listProjects().then(result => {
    console.log(result)
  })
}

main().catch(err => {
  console.error(err)
  process.exit(2)
})
