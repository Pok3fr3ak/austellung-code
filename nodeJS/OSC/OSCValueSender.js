module.exports = class OSCValueSender {
	
	constructor(udpClient) {
		this.udpClient = udpClient;
    }

    // matches message from https://github.com/yoggy/sendosc
    sendFloatValue(adress, float)
    {
        var floatBuffer = Buffer.alloc(4); // OSC wants binary 32 bit
        floatBuffer.writeFloatBE(float); // ... float BIG ENDIAN (always)
      
        var buffer = Buffer.concat([
          Buffer.from(adress), // osc adress
          Buffer.alloc(2), // two zero bytes (no idea why)
          Buffer.from(",f"), // f means argument will be float
          Buffer.alloc(2), // two zero bytes (no idea why)
          floatBuffer]);
        
        this.udpClient.sendMessage(buffer);
    }

    performFadeIn(adress)
    {
        // TODO implement
    }

    performFadeOut(adress)
    {
        // TODO implement
    }
}