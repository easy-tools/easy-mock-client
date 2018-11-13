var stringLength = function (str) {
  var realLength = 0
  var len = str.length
  var charCode = -1
  for (var i = 0; i < len; i++) {
    charCode = str.charCodeAt(i)
    if (charCode >= 0 && charCode <= 128) {
      realLength += 1
    } else {
      realLength += 2
    }
  }
  return realLength
}

module.exports = {
  stringLength,
  paddingRight: function (raw, max, pad) {
    var paddingLength = max
    var strLen = stringLength(raw) // Buffer.from(raw).length
    if (strLen > raw.length) {
      paddingLength -= strLen - raw.length
    }
    return raw.padEnd(paddingLength, pad)
  },
  pickFields: function(fields, content){
    let target = {}
    for (let key of fields) {
      if (typeof content[key] === 'undefined') {
        continue
      }
      target[key] = content[key]
    }
    return target
  },
}
