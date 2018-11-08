class BaseCommand {
  constructor() {
    this.context = {}
    this.handler = null
    this.client = null
  }

  getParams() {
    return this.context
  }

  setParams(context) {
    this.context = context
  }

  register(context, handler) {
    this.handler = handler
    this.context = context
  }

  execute(client) {
    if (typeof this.handler === 'function') {
      return this.handler.call(this, client, this.context)
    }
  }
}

module.exports = BaseCommand
