var dgram = require("dgram"); // node native module
// 1 socket for all network business
var socket = dgram.createSocket("udp4");

const SerialPort = require('serialport');
const port = new SerialPort('COM5', { // as displayed in Windows device manager
  baudRate: 9600
})

// Arduino delivers ASCII with CR LF newlines
var parser = port.pipe(new SerialPort.parsers.Readline({ delimiter: "\r\n", encoding: "ascii" }));
// SEND OSC
parser.on('data', function (data) {

  var intValue = parseInt(data.split("_")[1]); // dispatch individual potentiometers, to be continued

  var floatBuffer = Buffer.alloc(4); // OSC wants binary 32 bit
  // float is normalized (0 - 1) - Reaper wants this
  floatBuffer.writeFloatBE(intValue/127); // ... float BIG ENDIAN (always)


  var buffer = Buffer.concat([
    Buffer.from("/master/volume"), // osc adress - Reaper understands this
    Buffer.alloc(2), // two zero bytes (no idea why)
    Buffer.from(",f"), // f means argument will be float
    Buffer.alloc(2), // two zero bytes (no idea why)
    floatBuffer]);
  
  socket.send(buffer, 0, buffer.length, 5678, "127.0.0.1");
})

var TC = require("./MTC/TC.js");
var MessageSender = require("./MTC/MessageSender.js");
var MTCVideoSlavePlayer = require("./MTC/MTCVideoSlavePlayer.js");
const MTCVideoSlave_PORT = 13203;

var localhost = new MTCVideoSlavePlayer(
	new MessageSender(socket, "127.0.0.1", MTCVideoSlave_PORT));

localhost.play(new TC("00:00:10:00"), new TC("00:00:45:00"));