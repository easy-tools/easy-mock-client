var path = require('path')
var fs = require('fs')

var EXPIRE = 86400000

var tempPath = path.join(__dirname, '../temp/storage.tmp')

function loadTempSession(tempPath) {
  if (!fs.existsSync(tempPath)) {
    return null
  }

  var content = fs.readFileSync(tempPath, 'utf-8')
  var rawSession = Buffer.from(content, 'base64').toString()
  var sessionData = JSON.parse(rawSession)

  if (Date.now() > sessionData.timestamp + EXPIRE) {
    return null
  }

  return sessionData
}

function saveTempSession(tempPath, tempSession) {
  var jsonStr = JSON.stringify(tempSession)
  var cryptoStr = Buffer.from(jsonStr).toString('base64')

  var secondPath = tempPath.split('/').slice(0, -1).join('/')
  if (!fs.existsSync(secondPath)) {
    fs.mkdirSync(secondPath)
  }
  fs.writeFileSync(tempPath, cryptoStr)
}

module.exports = {
  loadTempSession,
  saveTempSession,
  loadSession: function () {
    const tempSession = loadTempSession(tempPath)
    if (tempSession && tempSession.session) {
      return tempSession.session
    }
    return null
  },
  loadConfig: function () {
    const tempSession = loadTempSession(tempPath)
    if (tempSession && tempSession.config) {
      return tempSession.config
    }
    return null
  },
  saveSession: function (userConfig, userSession) {
    this.saveTempSession(tempPath, {
      config: userConfig,
      session: userSession,
    })
  },
  isConnected: function () {
    const tempSession = loadTempSession(tempPath)

    if (tempSession) {
      return true
    }
    return false
  },
}
