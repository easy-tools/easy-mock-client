// var EasyMockClientAbstract = require('./abstract/client')

class EasyMockClient {//  extends EasyMockClientAbstract
  constructor(config) {
    this.isLogin = false
    this.token = ''
    this.session = null
    this.pendingList = []
    this.config = config

    // this.connect()
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

    if (!this.getHttpRequest()) {
      throw new Error('miss lib')
    }
    return this.getHttpRequest().create(requestConfig)
  }

  getHttpRequest() {
    return EasyMockClient.httpRequest
  }

  connect() {
    if (this.isLogin) {
      return Promise.resolve(true)
    }

    return this.getRequest().post('/api/u/login', this.config)
      .then((response) => {
        const responseData = response.data
        if (!responseData.success) {
          throw new Error(responseData.message)
        }

        this.isLogin = true
        this.session = responseData.data
        this.token = responseData.data.token
        this.__handlePending()
        // console.log(response.data)
        return responseData
      })
      .catch((error) => {
        this.__handlePending(error)
        return Promise.reject(error)
        // console.log(error)
      })
  }

  __handlePending(error) {
    while (this.pendingList.length) {
      const currentCall = this.pendingList.shift()
      currentCall.call(this, error)
    }
  }

  isConnected() {
    return this.isLogin
  }

  generatePost(url, data) {
    return this.getRequest().post(url, data).then(response => {
      const responseData = response.data
      if (!responseData.success) {
        throw new Error(responseData.message)
      }
      return responseData
    })
  }

  generateGet(url, params) {
    return this.getRequest().get(url, {
      params: params
    }).then(response => {
      const responseData = response.data
      if (!responseData.success) {
        throw new Error(responseData.message)
      }
      return responseData
    })
  }

  deleteMock(mockId) {
    const handler = () => {
      return this.generatePost('/api/mock/delete', Object.assign({
        id: mockId
      }))
    }

    return this.__compose(handler)
  }

  updateMock(mockData) {
    const fields = ['description', 'method', 'mode', 'id', 'url']
    for (let key of fields) {
      if (typeof mockData[key] === 'undefined') {
        return Promise.reject('参数错误')
      }
    }

    const handler = () => {
      return this.generatePost('/api/mock/update', Object.assign({}, mockData))
    }

    return this.__compose(handler)
  }

  createMock(mockData) {
    const fields = ['description', 'method', 'mode', 'project_id', 'url']
    for (let key of fields) {
      if (typeof mockData[key] === 'undefined') {
        return Promise.reject('参数错误')
      }
    }

    const handler = () => {
      return this.generatePost('/api/mock/create', Object.assign({}, mockData))
    }

    return this.__compose(handler)
  }

  getMock(project) {
    const handler = () => {
      return this.generateGet('/api/mock', {
        project_id: project,
        page_size: 2000,
        page_index: 1,
        keywords: '',
      })
    }

    return this.__compose(handler)
  }

  createProject(projectData) {
    const fields = ['description', 'group', 'id', 'url', 'name']
    const OPTION_FIELDS = ['group', 'id', 'members', 'swagger_url']
    for (let key of fields) {
      if (typeof projectData[key] === 'undefined' && !OPTION_FIELDS.includes(key)) {
        return Promise.reject('参数错误')
      }
    }

    const handler = () => {
      return this.generatePost('/api/project/create', Object.assign({}, projectData))
    }

    return this.__compose(handler)
  }

  updateProject(projectData) {
    const handler = () => {
      return this.generatePost('/api/project/update', Object.assign({}, projectData))
    }

    return this.__compose(handler)
  }

  deleteProject(projectId) {
    const handler = () => {
      return this.generatePost('/api/project/delete', Object.assign({
        id: projectId,
      }))
    }

    return this.__compose(handler)
  }

  listProjects() {
    const handler = () => {
      return this.generateGet('/api/project', {
        page_size: 30,
        page_index: 1,
        filter_by_author: 0,
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
          return
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

EasyMockClient.setHttpRequest = function (httpRequest) {
  EasyMockClient.httpRequest = httpRequest
}

module.exports = EasyMockClient
