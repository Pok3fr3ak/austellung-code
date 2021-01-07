// has to be installed with: npm install serialport
const SerialPort = require('serialport');
const Emitter = require('events').EventEmitter;

module.exports = class ArduinoClient { // has to match Arduino SW, values are NOT checked
    
    emitter = new Emitter();

	constructor(serialPortName) {
        
        // immediately opens port
        var port = new SerialPort(serialPortName, { 
            baudRate: 9600
        }, (error) => { if (error) throw "Could not connect to Arduino: " + error }); // no arduino or wrong port will give us an error here
    
        // Arduino delivers ASCII with CR LF newlines
        var parser = port.pipe(new SerialPort.parsers.Readline({ delimiter: "\r\n", encoding: "ascii" }));

        var emitter = this.emitter; // closure

        parser.on('data', function (data) {
           var nameValuePair = data.split("_");
           var intValue = parseInt(nameValuePair[1]); // currently 0 - 127
           var name = nameValuePair[0]; // eg. A5 for Analog In 6
           // raise events for subscribers
           emitter.emit(name, intValue);
        });
    }

    // TODO continue for each active pot/switch
    onPotentiometer_6(callback)
    {
        this.emitter.addListener("A5", callback);
    }
}