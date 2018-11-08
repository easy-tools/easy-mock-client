let chai = require('chai')
let path = require('path')

let EasyMockClient = require('../../lib/client')
let RequestMock = require('../request')
let mockData = require('../mock.json')

let { expect, assert } = chai

EasyMockClient.setHttpRequest(RequestMock)

const client = new EasyMockClient({})
let source = Date.now()
let mockCreated = {
  "id": "5be40349380a47002f437483",
  "url": "/api/status",
  "method": "get",
  "project_id": source,
  "description": "status dem", "mode": "{\n  \"status\": 0\n}", "parameters": null, "response_model": null
}

describe('should easy mock work', function () {
  it('should connect', function (done) {
    client.connect().then((responseData) => {
      expect(responseData).to.be.equal(RequestMock.fetchMockData('login').data)
      done()
    })
  })

  it('should get project list', function (done) {
    client.listProjects().then(responseData => {
      expect(responseData).to.be.equal(RequestMock.fetchMockData('listProjects').data)
      done()
    })
  })

  it('should get mock', function (done) {
    client.getMock(source).then(responseData => {
      expect(responseData).to.be.equal(RequestMock.fetchMockData('getMock').data)
      done()
    })
  })

  it('should delete mock', function (done) {
    client.deleteProject(source).then(responseData => {
      expect(responseData).to.be.equal(RequestMock.fetchMockData('deleteProject').data)
      done()
    })
  })

  it('should delete project', function (done) {
    client.deleteMock(source).then(responseData => {
      expect(responseData).to.be.equal(RequestMock.fetchMockData('deleteMock').data)
      done()
    })
  })

  it('should create mock', function (done) {
    client.createMock(mockCreated).then(responseData => {
      expect(responseData).to.be.equal(RequestMock.fetchMockData('createMock').data)
      done()
    })
  })

  it('should create mock fail', function (done) {
    client.createMock({}).catch(err => {
      expect(err).to.be.equal('参数错误')
      done()
    })
  })

  it('should update mock', function (done) {
    client.updateMock(mockCreated).then(responseData => {
      expect(responseData).to.be.equal(RequestMock.fetchMockData('updateMock').data)
      done()
    })
  })

  it('should update mock fail', function (done) {
    client.updateMock({}).catch(err => {
      expect(err).to.be.equal('参数错误')
      done()
    })
  })
})
