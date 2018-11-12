let chai = require('chai')
let path = require('path')

let EasyMockClient = require('../../lib/client')
let RequestMock = require('../request')
let mockData = require('../mock')

let { expect, assert } = chai

EasyMockClient.setHttpRequest(RequestMock)

const client = new EasyMockClient({})
let source = Date.now()
let mockCreated = mockData.data.mockCreated

let projectCreated = mockData.data.projectCreated

describe('test easy mock client', function () {
  it('should connect', function (done) {
    client.connect().then((responseData) => {
      expect(responseData).to.be.equal(RequestMock.fetchMockData('login').data)
    })

    client.listProjects().then(responseData => {
      expect(responseData).to.be.equal(RequestMock.fetchMockData('listProjects').data)
      assert.isTrue(client.isConnected())
      client.connect().then(response => {
        assert.isTrue(response)
        done()
      })
    })
  })

  describe('should easy mock work fine', function () {
    it('should generate Post work', function (done) {
      client.generatePost('/api/error/post', {}).catch(err => {
        expect(err).to.be.an('error')
        expect(err.message).to.be.equal('fail')
        done()
      })
    })

    it('should generate Get work', function (done) {
      client.generateGet('/api/error/get', {}).catch(err => {
        expect(err).to.be.an('error')
        expect(err.message).to.be.equal('fail')
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

    it('should create project', function (done) {
      client.createProject(projectCreated).then(responseData => {
        expect(responseData).to.be.equal(RequestMock.fetchMockData('createProject').data)
        done()
      })
    })

    it('should update mock', function (done) {
      client.updateMock(mockCreated).then(responseData => {
        expect(responseData).to.be.equal(RequestMock.fetchMockData('updateMock').data)
        done()
      })
    })
  })

  describe('should easy mock fail', function () {
    it('should create project fail', function (done) {
      client.createProject({}).catch(err => {
        expect(err).to.be.equal('参数错误')
        done()
      })
    })

    it('should create mock fail', function (done) {
      client.createMock({}).catch(err => {
        expect(err).to.be.equal('参数错误')
        done()
      })
    })

    it('should update mock fail', function (done) {
      client.updateMock({}).catch(err => {
        expect(err).to.be.equal('参数错误')
        done()
      })
    })

    it('should throw when get http empty', function () {
      const errorClient = new EasyMockClient({})
      errorClient.getHttpRequest = () => { return null }

      expect(() => {
        errorClient.getRequest()
      }).to.throw(Error)
    })
  })

  describe('should mock client for inner function', function () {
    const expectError = new Error(Date.now())
    const expectMsg = Date.now().toString(36)
    const errorClient = new EasyMockClient({})

    it('should throw network fail connect', function (done) {
      errorClient.getRequest = () => {
        return {
          post: () => {
            return Promise.reject(expectError)
          }
        }
      }

      errorClient.connect().catch((error) => {
        expect(error).to.be.equal(expectError)
        done()
      })
    })


    it('should throw connect login fail', function (done) {
      errorClient.getRequest = () => {
        return {
          post: () => {
            return Promise.resolve({
              "data": {
                success: false,
                message: expectMsg,
              }
            })
          }
        }
      }

      errorClient.connect().catch((error) => {
        expect(error.message).to.be.equal(expectMsg)
        done()
      })
    })

    it ('should compose reject', function(done){
      const rejectFunc = function () {
        return Promise.reject(expectError)
      }
      errorClient.__compose(rejectFunc).catch(error => {
        expect(error).to.be.equal(expectError)
        done()
      })
      expect(errorClient.pendingList.length).to.be.equal(1)
      errorClient.__handlePending(expectError)
    })

    it ('should compose handler reject', function(done){
      const rejectFunc = function () {
        return Promise.reject(expectError)
      }
      errorClient.__compose(rejectFunc).catch(error => {
        expect(error).to.be.equal(expectError)
        done()
      })
      expect(errorClient.pendingList.length).to.be.equal(1)
      errorClient.__handlePending()
    })
  })
})
