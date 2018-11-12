const mockData = require('./mock')

class RequestMock {
  constructor(requestConfig) {
    this.requestConfig = requestConfig
  }

  request(options) {
    return new Promise((resolve, reject) => {
      if (RequestMock.mockData[options.url] && RequestMock.mockData[options.url].method === options.method) {
        resolve(RequestMock.mockData[options.url].response)
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

RequestMock.mockData = mockData.api
RequestMock.fetchMockData = function (name) {
  const url = mockData.route[name]
  if (!url || !mockData.api[url]) {
    return null
  }
  return mockData.api[url].response
}
RequestMock.create = (requestConfig) => {
  return new RequestMock(requestConfig)
}

module.exports = RequestMock
