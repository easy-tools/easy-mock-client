let chai = require('chai')
let path = require('path')

let EasyMockClient = require('../../lib/client')
let RequestMock = require('../request')
let mockData = require('../mock.json')

let { expect, assert } = chai

EasyMockClient.setHttpRequest(RequestMock)

const client = new EasyMockClient({})
let source = Date.now()

describe('should easy mock work', function () {
  it('should connect', function (done) {
    client.connect().then((responseData) => {
      expect(responseData).to.be.equal(RequestMock.fetchMockData('login').data)
      done()
    })
  })

  it('show get project list', function (done) {
    client.listProjects().then(response => {
      done()
    })
  })

  it('show get mock', function (done) {
    client.getMock(source).then(response => {
      done()
    })
  })
})
