module.exports = class UDPClient {
	constructor(socket, host, port) {
		this.socket = socket;
		this.host = host;
		this.port = port;
	}

	sendMessage(buffer) {
		this.socket.send(buffer, 0, buffer.length, this.port, this.host);
	}
}