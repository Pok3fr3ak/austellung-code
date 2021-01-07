const MTC_Helper = require("./MTC_Helper.js");
const TC = require("./TC.js");

// MTCVideoSlave custom UUID
const UUID = "330599457c33483fa81cf8ba39ffa0c0"; // ES6 classes have no consts

module.exports = class MTCVideoSlavePlayer {

	// hardcoded port the MTCVideoSlave is listening on
	static get PORT() { return 13203; }
	
	constructor(udpClient) {
		this.udpClient = udpClient;
		this.loop; // for setInterval()
	}

	// ES 6 iterator
	// endless stream of "quarter frame messages"
	*[Symbol.iterator](startTime, endTime, endedCallback) {
		var ended = endedCallback; // closure
		while(true) // iterators are endless in JavaScript, so stays at last frame
		{
			yield* MTC_Helper.getEightQuarterFrameMessages(startTime);
			
			if (startTime.totalFramesCount <= endTime.totalFramesCount)
				// after 8 quarter frame messages
				// one complete timecode has been sent
				// need to advance 2 frames
				startTime.addTwoFrames();
			else
			{
				if (ended)
					ended();
				
				ended = undefined;
			}	
		}
	}

	play(startTime, endTime, endedCallback)
	{
		var ended = endedCallback; // closure
		var that = this; // closure
		var playbackIterator = this[Symbol.iterator](
			startTime,
			endTime,
			// has ended callback
			function() {
				that.stopAndRewind();
				// bubble event
				if (ended)
					ended();
			});
		
		var udpClient = this.udpClient; // closure
		this.loop = setInterval(function() {
			// grab 4 of 8 quarter frame messages
			// send each 40ms
			// optimal tradeoff for MTCVideoSlave
			// 1 msg per 10ms ("quarter frame")
			// 4 msg per 40ms (1 frame at 25 FPS)

			var hexString = UUID +
			playbackIterator.next().value +
			playbackIterator.next().value +
			playbackIterator.next().value +
			playbackIterator.next().value;

			udpClient.sendMessage(
				Buffer.from(hexString, "hex"));
				
		}, 40);
	}

	stopAndRewind()
	{
		clearInterval(this.loop);
		// send full message with position zero
		this.udpClient.sendMessage(
			Buffer.from(MTC_Helper.getTimecodeMessage(TC.ZERO), "hex"));
	}
}