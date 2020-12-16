var dgram = require("dgram"); // node native module

var TC = require("./MTC/TC.js");
var MessageSender = require("./MTC/MessageSender.js");
var MTCVideoSlavePlayer = require("./MTC/MTCVideoSlavePlayer.js");

const MTCVideoSlave_PORT = 13203;

// 1 socket for all network business
var socket = dgram.createSocket("udp4");

var localhost = new MTCVideoSlavePlayer(
	new MessageSender(socket, "127.0.0.1", MTCVideoSlave_PORT));

localhost.play(new TC("00:00:10:00"), new TC("00:00:45:00"));