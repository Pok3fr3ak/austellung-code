// has to be installed with: npm install smpte-timecode
var Timecode = require("smpte-timecode");

// proxy object to Timecode with fixed 25 FPS
module.exports = class TC {

	static get ZERO() { return new TC("00:00:00:00"); }

	constructor(positionString) {
		this.timecode = new Timecode(positionString, 25);
	}

	addTwoFrames() {
		this.timecode.add(2);
	}

	get frameRate() { return 25; }
	get hours() { return this.timecode.hours; }
	get minutes() { return this.timecode.minutes; }
	get seconds() { return this.timecode.seconds; }
	get frames() { return this.timecode.frames; }
	get totalFramesCount() { return this.timecode.frameCount; }
} 