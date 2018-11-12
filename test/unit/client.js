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
    const fineMockConfig = [{
      exec: 'listProjects',
      params: [],
      name: 'list all project',
    }, {
      exec: 'getMock',
      params: [source],
      name: 'get mock data',
    }, {
      exec: 'deleteProject',
      params: [source],
      name: 'delete single project',
    }, {
      exec: 'deleteMock',
      params: [source],
      name: 'delete single mock',
    }, {
      exec: 'createMock',
      params: [mockCreated],
      name: 'create single mock',
    }, {
      exec: 'createProject',
      params: [projectCreated],
      name: 'create single project',
    }, {
      exec: 'updateMock',
      params: [mockCreated],
      name: 'update mock data',
    }]

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

    it('should call client functions', function (done) {
      Promise.all(fineMockConfig.map(item => {
        return client[item.exec].apply(client, item.params)
      })).then(testResults => {
        for (let i in testResults) {
          let responseData = testResults[i]
          let item = fineMockConfig[i]
          expect(responseData).to.be.equal(RequestMock.fetchMockData(item.exec).data)
        }
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

    it('should compose reject', function (done) {
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

    it('should compose handler reject', function (done) {
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
