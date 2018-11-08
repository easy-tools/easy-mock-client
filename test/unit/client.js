var chai = require('chai')
var path = require('path')

var EasyMockClient = require('../../lib/client')
var RequestMock = require('../request')

var { expect, assert } = chai

EasyMockClient.setHttpRequest(RequestMock)

const client = new EasyMockClient({})

describe('should easy mock work', function () {
  it('should connect', function (done) {
    var source = Date.now()
    client.connect().then((responseData) => {
      expect(responseData).to.be.equal(RequestMock.mockData['/api/u/login'].response.data)
      done()
    })
  })
})
