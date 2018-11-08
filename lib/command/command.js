class BaseCommand {
  constructor() {
    this.params = {}
    this.handler = null
    this.client = null
  }

  getParams() {
    return this.params
  }

  setParams(params) {
    this.params = params
  }

  register(client, handler) {
    this.handler = handler
    this.client = client
  }

  execute(params) {
    if (typeof this.handler === 'function') {
      this.handler.call(this, params)
    }
  }
}

module.exports = BaseCommand
