
class EasyMockClient {
  constructor(config) {
    this.isLogin = false
    this.token = ''
    this.user = null
    this.pendingList = []
    this.config = config

    this.connect()
  }

  getRequest() {
    const requestConfig = {
      baseURL: this.config.host,
      timeout: 10000,
    }

    if (this.isLogin) {
      requestConfig.headers = {
        Authorization: `Bearer ${this.token}`,
      }
    }

    if (!EasyMockClient.httpRequest) {
      throw new Error('miss lib')
    }
    return EasyMockClient.httpRequest.create(requestConfig)
  }

  connect() {
    if (this.isLogin) {
      return
    }
    return this.getRequest().post('/api/u/login', this.userConfig)
      .then((response) => {
        const responseData = response.data
        if (responseData.success) {
          this.isLogin = true
          this.user = responseData.data
          this.token = responseData.data.token
        }
        this.__handlePending()
        // console.log(response.data)
        return responseData
      })
      .catch(function (error) {
        this.__handleError(error)
        console.log(error)
      })
  }

  __handleError(error) {
    while (this.pendingList.length) {
      const currentCall = this.pendingList.shift()
      currentCall.call(this, error)
    }
  }

  __handlePending() {
    while (this.pendingList.length) {
      const currentCall = this.pendingList.shift()
      currentCall.apply(this)
    }
  }

  isConnected() {
    return this.isLogin
  }

  updateMock(mockData) {
    const fields = ['description', 'method', 'mode', 'id', 'url']
    for (let key of fields) {
      if (typeof mockData === 'undefined') {
        return Promise.reject('参数错误')
      }
    }

    const handler = () => {
      return this.getRequest().post('/api/mock/update', Object.assign({
      }, mockData)).then(response => {
        const responseData = response.data
        if (!responseData.success) {
          throw new Error(responseData.message)
        }
        return responseData
      })
    }

    return this.__compose(handler)
  }

  createMock(mockData) {
    const fields = ['description', 'method', 'mode', 'project_id', 'url']
    for (let key of fields) {
      if (typeof mockData === 'undefined') {
        return Promise.reject('参数错误')
      }
    }

    const handler = () => {
      return this.getRequest().post('/api/mock/create', Object.assign({
      }, mockData)).then(response => {
        const responseData = response.data
        if (!responseData.success) {
          throw new Error(responseData.message)
        }
        return responseData
      })
    }

    return this.__compose(handler)
  }

  getMock(project) {
    const handler = () => {
      return this.getRequest().get('/api/mock', {
        params: {
          project_id: project,
          page_size: 2000,
          page_index: 1,
          keywords: '',
        }
      }).then(response => {
        const responseData = response.data
        if (!responseData.success) {
          throw new Error(responseData.message)
        }
        return responseData
      })
    }

    return this.__compose(handler)
  }

  listProjects() {
    const handler = () => {
      return this.getRequest().get('/api/project', {
        params: {
          page_size: 30,
          page_index: 1,
          filter_by_author: 0,
        }
      }).then(response => {
        const responseData = response.data
        if (!responseData.success) {
          throw new Error(responseData.message)
        }
        return responseData
      })
    }

    return this.__compose(handler)
  }

  __compose(handler) {
    if (this.isLogin) {
      return handler()
    }

    return new Promise((resolve, reject) => {
      var callback = (err) => {
        if (err) {
          reject(err)
        }

        handler().then(function (response) {
          resolve(response)
        })
          .catch(function (error) {
            reject(error)
          })
      }

      this.pendingList.push(callback)
    })
  }
}

module.exports = EasyMockClient
