var axios = require('axios')
var EasyMockClient = require('./client')

EasyMockClient.setHttpRequest(axios)

EasyMockClient.Factory = function(options, callback) {
  var client = new EasyMockClient(options)
  var connectPromise = client.connect()
  if (typeof callback === 'function') {
    connectPromise.then(function(response) {
      console.log('Connect Build')
    })
  }

  return client
}

module.exports = EasyMockClient
