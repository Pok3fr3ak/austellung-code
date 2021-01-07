// 1 socket for all UDP network business
const socket = require("dgram").createSocket("udp4"); // node native module

const TC = require("./MTC/TC.js");
const UDPClient = require("./UDPClient.js");
const MTCVideoSlavePlayer = require("./MTC/MTCVideoSlavePlayer.js");
const OSCValueSender = require("./OSC/OSCValueSender.js");
const ArduinoClient = require("./Arduino/ArduinoClient.js");

// HERE STARTS THE FUN WITH THE ACTUAL GAME LOGIC...

var reaper = new OSCValueSender(new UDPClient(socket, "127.0.0.1", 5678));

// "COM5" or as displayed in Windows device manager
var arduino = new ArduinoClient("COM7");

arduino.onPotentiometer_6((intValue) => {
   // float is normalized (0 - 1) - Reaper wants this
   var normalized = intValue/127;
   // Reaper understands this
   reaper.sendFloatValue("/master/volume", normalized);
});

var localhostPlayer = new MTCVideoSlavePlayer(
	new UDPClient(socket, "127.0.0.1", MTCVideoSlavePlayer.PORT));

localhostPlayer.play(new TC("00:00:10:00"), new TC("00:00:12:00"), () => console.log("ended"));