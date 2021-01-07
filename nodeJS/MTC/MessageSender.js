module.exports = class MessageSender {
	constructor(socket, host, port) {
		this.socket = socket;
		this.host = host;
		this.port = port;
	}

	send(hexString) {
		var buffer = Buffer.from(hexString, "hex");
		this.socket.send(buffer, 0, buffer.length, this.port, this.host);
	}
}