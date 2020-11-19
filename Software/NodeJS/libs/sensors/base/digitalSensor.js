var util         = require('util')
var Sensor       = require('./sensor')
var commands     = require('../../commands')

function DigitalSensor(pin) {
  Sensor.apply(this, Array.prototype.slice.call(arguments))
  this.pin = pin
}
util.inherits(DigitalSensor, Sensor)
DigitalSensor.prototype = new DigitalSensor()

DigitalSensor.prototype.read = function() {
  var writeRet = this.board.writeBytes(commands.dRead.concat([this.pin, commands.unused, commands.unused]))
  if (writeRet) {
    this.board.wait(100)
    // on old version, this.board.readBytes(2)[1] returns 255 and this.board.readBytes()[0] returns the buttom value
    // newer? version, this.board.readBytes()[0] returns 1 and this.board.readBytes(2)[1] returns the buttom value
    let v = this.board.readBytes(2)[1]
    if (v !== 0 && v !== 1) {
      return this.board.readBytes()[0]
    } else {
      return v
    }
  } else {
    return false
  }
}
DigitalSensor.prototype.write = function(value) {
  return this.board.writeBytes(commands.dWrite.concat([this.pin, value, commands.unused]))
}

module.exports = DigitalSensor
