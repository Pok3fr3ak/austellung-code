module.exports = class MTC_Helper {
	// returns an array of 8 2-byte-hex-strings in the form
	// ["F100", "F110", "F12A", "F1030", "F140", "F150", "F160", "F1072",]
	// meaning 00:00:10:00 at 25FPS

	// 0 	0000 ffff 	Frame number lsbits
	// 1 	0001 000f 	Frame number msbit
	// 2 	0010 ssss 	Second lsbits
	// 3 	0011 00ss 	Second msbits
	// 4 	0100 mmmm 	Minute lsbits
	// 5 	0101 00mm 	Minute msbits
	// 6 	0110 hhhh 	Hour lsbits
	// 7 	0111 0rrh 	Rate and hour msbit
	static getEightQuarterFrameMessages(timecode)
	{
		if (timecode.hours > 0b00011111)
			throw "Hours cannot be greater than 0b00011111, only 5 bits reserved for them.";

		return [
		0b0000 << 4 | timecode.frames & 0x0F, // add mask is 0000 1111
		0b0001 << 4 | timecode.frames >> 4, // 4 times right shift
		0b0010 << 4 | timecode.seconds & 0x0F,
		0b0011 << 4 | timecode.seconds >> 4,
		0b0100 << 4 | timecode.minutes & 0x0F,
		0b0101 << 4 | timecode.minutes >> 4,
		0b0110 << 4 | timecode.hours & 0x0F,
		0b0111 << 4 | this.getFramerateNibble(timecode) | timecode.hours >> 4
		].map(x => 
			"F1" + // status byte, specified by MIDI as timecode msg
			this.numberToHex(x) // payload byte ie. data
		);
	}

	// full SYSX message for jumps and initialization
	static getTimecodeMessage(timecode)
	{
		return "F0" + // sysex anfang
			"7F" + // real-time universal message (127)
			"7F" + // channel global broadcast (127)
			"01" + // it is timecode
			"01" + // it is full timecode msg
			// I really cannot figure out why "THIS" is needed to call a static method!?
			this.numberToHex(this.getFramerateNibble(timecode) << 4 | timecode.hours) + // rate and hh
			this.numberToHex(timecode.minutes) + // mm
			this.numberToHex(timecode.seconds) + // ss
			this.numberToHex(timecode.frames) + // ff
			"F7"; // sysex ende
	}

	// nibble is half a byte ie. 4 bits
	static getFramerateNibble(timecode)
	{
		// rate and hh
		// BITS: 0rrh hhhh
		// rr = 00: 24 frames/s
		// rr = 01: 25 frames/s
		// rr = 10: 29.97 frames/s
		// rr = 11: 30 frames/s
		switch(timecode.frameRate) {
			case 24:
				return 0b0000; // 0-00-0 0000
			case 25:
				return 0b0010; // 0-01-0 0000
			case 29.97:
				return 0b0100; // 0-10-0 0000
			case 30:
				return 0b0110; // 0-11-0 0000
			default:
			throw "MTC does not support framerate " + timecode.frameRate;
		}
	}

	// in JavaScript, all numbers are a 64 bit float
	static numberToHex(float)
	{
		if (float < 0)
			throw "Number must be zero or greater.";

		// add leading "0" if missing
		return Math.trunc(float).toString(16).padStart(2, "0");
	}
}