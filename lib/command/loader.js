var path = require('path')
var fs = require('fs')

var EXPIRE = 86400000 * 2

function StorageLoader(tempPath) {
  this.tempPath = tempPath
}

StorageLoader.prototype.__loadTempSession = function (tempPath) {
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

StorageLoader.prototype.__saveTempSession = function (tempPath, tempSession) {
  var jsonStr = JSON.stringify(tempSession)
  var cryptoStr = Buffer.from(jsonStr).toString('base64')

  var secondPath = tempPath.split('/').slice(0, -1).join('/')
  if (!fs.existsSync(secondPath)) {
    fs.mkdirSync(secondPath)
  }
  fs.writeFileSync(tempPath, cryptoStr)
}

StorageLoader.prototype.loadSession = function () {
  var tempSession = this.__loadTempSession(this.tempPath)
  if (tempSession && tempSession.session) {
    return tempSession.session
  }
  return null
}

StorageLoader.prototype.loadConfig = function () {
  var tempSession = this.__loadTempSession(this.tempPath)
  if (tempSession && tempSession.config) {
    return tempSession.config
  }
  return null
}

StorageLoader.prototype.saveSession = function (userConfig, userSession) {
  this.__saveTempSession(this.tempPath, {
    config: userConfig,
    session: userSession,
  })
}

StorageLoader.prototype.isConnected = function () {
  var tempSession = this.__loadTempSession(this.tempPath)

  if (tempSession) {
    return true
  }
  return false
}

module.exports = StorageLoader
