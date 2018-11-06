var axios = require('axios')
var EasyMockClient = require('./mockClient')

EasyMockClient.httpRequest = axios

module.exports = EasyMockClient