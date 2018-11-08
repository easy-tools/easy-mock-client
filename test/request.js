const mockData = require('./mock.json')

class RequestMock {
  constructor(requestConfig) {
    this.requestConfig = requestConfig
  }

  request(options) {
    return new Promise((resolve, reject) => {
      if (mockData[options.url] && mockData[options.url].method === options.method) {
        resolve(mockData[options.url].response)
      } else {
        reject(new Error('Not Found'))
      }
    })
  }

  post(url, options) {
    return this.request(Object.assign({
      method: 'POST',
      url,
      data: options,
    }))
  }

  get(url, options) {
    return this.request(Object.assign({
      method: 'GET',
      url,
    }, options))
  }
}

RequestMock.mockData = mockData
RequestMock.create = (requestConfig) => {
  return new RequestMock(requestConfig)
}

module.exports = RequestMock
