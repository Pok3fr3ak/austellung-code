var MTC_Helper = require("./MTC_Helper.js");

// MTCVideoSlave custom UUID
const UUID = "330599457c33483fa81cf8ba39ffa0c0";

module.exports = class MTCVideoSlavePlayer {
	constructor(messageSender) {
		this.messageSender = messageSender;
	}

	// ES 6 iterator
	// endless stream of "quarter frame messages"
	*[Symbol.iterator](startTime, endTime, endedCallback) {
		var ended = endedCallback;
		while(true) // iterators are endless in JavaScript, so stays at last frame
		{
			yield* MTC_Helper.getEightQuarterFrameMessages(startTime);
			
			if (startTime.totalFramesCount <= endTime.totalFramesCount)
				// after 8 quarter frame messages
				// the complete timecode information has been sent
				// need to advance 2 frames for the next round
				startTime.addTwoFrames();
			else
			{
				if (ended)
					ended();
				
				ended = undefined;
			}	
		}
	}

	play(startTime, endTime)
	{	
		var playbackIterator = this[Symbol.iterator](
			startTime,
			endTime,
			// has ended callback
			function() {
				clearInterval(loop);
			});
		
		var messageSender = this.messageSender;
		
		var loop = setInterval(function() {
			// grab 4 of 8 quarter frame messages
			// send each 40ms
			// optimal tradeoff for MTCVideoSlave
			// 1 msg per 10ms ("quarter frame")
			// 4 msg per 40ms (1 frame at 25 FPS)
			messageSender.send(
				UUID +
				playbackIterator.next().value +
				playbackIterator.next().value +
				playbackIterator.next().value +
				playbackIterator.next().value);
		}, 40);
	}
}