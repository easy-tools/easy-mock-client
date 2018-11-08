module.exports = {
  paddingRight: function (raw, max, pad) {
    var paddingLength = max
    if (Buffer.from(raw).length > raw.length) {
      paddingLength -= (Buffer.from(raw).length - raw.length) / 2
    }
    return raw.padEnd(paddingLength, pad)
  }
}
