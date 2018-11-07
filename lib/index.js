var axios = require('axios')
var EasyMockClient = require('./client')
var clientStorage = require('./loader')

EasyMockClient.httpRequest = axios

EasyMockClient.Factory = function(options) {
  var client = null
  if (clientStorage.isConnected()) {
    client = new EasyMockClient(clientStorage.loadConfig())
    client.load(clientStorage.loadSession())
  } else {
    client = new EasyMockClient(options)
    client.connect()
  }

  return client
}

module.exports = EasyMockClient
