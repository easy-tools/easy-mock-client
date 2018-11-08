var colors = require('colors/safe')

function withColor(color) {
  return function(content) {
    if (color && colors[color]) {
      return colors[color].call(colors, content)
    }
    return content
  }
}

function buildLog(level, color) {
  return function () {
    var printContents = Array.from(arguments)
    console[level].apply(null, printContents.map(withColor(color)))
  }
}

module.exports = {
  info: buildLog('log'),
  error: buildLog('log', 'red'),
  warn: buildLog('warn', 'green'),
}
