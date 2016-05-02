// run this function when the document has loaded
$(function() {

	// try {
	// 	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	// 	window.audioContext = new window.AudioContext();
	// } catch (e) {
	// 	console.log("No Web Audio API support");
	// }

	// /*
	//  * WebAudioAPISoundManager Constructor
	//  */
	//  var WebAudioAPISoundManager = function (context) {
	// 	this.context = context;
	// 	this.bufferList = {};
	// 	this.playingSounds = {};
	// };

	// /*
	//  * WebAudioAPISoundManager Prototype
	//  */
	// WebAudioAPISoundManager.prototype = {
	// 	 addSound: function (url) {
	// 		// Load buffer asynchronously
	// 		var request = new XMLHttpRequest();
	// 		request.open("GET", url, true);
	// 		request.responseType = "arraybuffer";

	// 		var self = this;

	// 		request.onload = function () {
	// 			// Asynchronously decode the audio file data in request.response
	// 			self.context.decodeAudioData(
	// 				request.response,

	// 				function (buffer) {
	// 					if (!buffer) {
	// 						alert('error decoding file data: ' + url);
	// 						return;
	// 					}
	// 					self.bufferList[url] = buffer;
	// 				});
	// 		};

	// 		request.onerror = function () {
	// 			alert('BufferLoader: XHR error');
	// 		};

	// 		request.send();
	// 	},
	// 	stopSoundWithUrl: function(url) {
	// 		if(this.playingSounds.hasOwnProperty(url)){
	// 			for(var i in this.playingSounds[url]){
	// 				if(this.playingSounds[url].hasOwnProperty(i))
	// 					this.playingSounds[url][i].noteOff(0);
	// 			}
	// 		}
	// 	}
	// };

	// /*
	//  * WebAudioAPISound Constructor
	//  */
	//  var WebAudioAPISound = function (url, options) {
	// 	this.settings = {
	// 		loop: false
	// 	};

	// 	for(var i in options){
	// 		if(options.hasOwnProperty(i))
	// 			this.settings[i] = options[i];
	// 	}

	// 	this.url = url + '.mp3';
	// 	window.webAudioAPISoundManager = window.webAudioAPISoundManager || new WebAudioAPISoundManager(window.audioContext);
	// 	this.manager = window.webAudioAPISoundManager;
	// 	this.manager.addSound(this.url);
	// };

	// /*
	//  * WebAudioAPISound Prototype
	//  */
	// WebAudioAPISound.prototype = {
	// 	play: function () {
	// 		var buffer = this.manager.bufferList[this.url];
	// 		//Only play if it's loaded yet
	// 		if (typeof buffer !== "undefined") {
	// 			var source = this.makeSource(buffer);
	// 			source.loop = this.settings.loop;
	// 			source.noteOn(0);

	// 			if(!this.manager.playingSounds.hasOwnProperty(this.url))
	// 				this.manager.playingSounds[this.url] = [];
	// 			this.manager.playingSounds[this.url].push(source);
	// 		}
	// 	},
	// 	stop: function () {
	// 		this.manager.stopSoundWithUrl(this.url);
	// 	},
	// 	getVolume: function () {
	// 		return this.translateVolume(this.volume, true);
	// 	},
	// 	//Expect to receive in range 0-100
	// 	setVolume: function (volume) {
	// 		this.volume = this.translateVolume(volume);
	// 	},
	// 	translateVolume: function(volume, inverse){
	// 		return inverse ? volume * 100 : volume / 100;
	// 	},
	// 	makeSource: function (buffer) {
	// 		var source = this.manager.context.createBufferSource();
	// 		var gainNode = this.manager.context.createGainNode();
	// 		gainNode.gain.value = this.volume;
	// 		source.buffer = buffer;
	// 		source.connect(gainNode);
	// 		gainNode.connect(this.manager.context.destination);
	// 		return source;
	// 	}
	// };


	// var yepSound;
	// yepSound = new WebAudioAPISound("sounds/yep.mp3");

	var client = mqtt.connect('mqtt://86241baa:660d67a40f0bfa38@broker.shiftr.io', {
		clientId: 'browser'
	});

	var slideDelay = 800;

	client.on('connect', function() {
		console.log('client has connected!');

		client.subscribe('/state');
		client.subscribe('/ethic-level');
		client.subscribe('/questions');
		client.subscribe('/question-nr');
		client.subscribe('/results');
		client.subscribe('/sounds');
		client.subscribe('/answer');
	});

	client.on('message', function(topic, message) {
		console.log('new message:', topic, message.toString());

		if (topic == "/ethic-level") {

			var ethicLevel = message.toString();

			switch (ethicLevel) {
				case "1":
					$('.ethic-level-setting__dot-wrapper').removeClass("is-selected");
					$('.ethic-level-setting__dot-wrapper--1').addClass("is-selected");
					break;
				case "2":
					$('.ethic-level-setting__dot-wrapper').removeClass("is-selected");
					$('.ethic-level-setting__dot-wrapper--2').addClass("is-selected");
					break;
				case "3":
					$('.ethic-level-setting__dot-wrapper').removeClass("is-selected");
					$('.ethic-level-setting__dot-wrapper--3').addClass("is-selected");
					break;
				case "4":
					$('.ethic-level-setting__dot-wrapper').removeClass("is-selected");
					$('.ethic-level-setting__dot-wrapper--4').addClass("is-selected");
					break;
				default:
					console.log("ethicLevel Error");
			}
		} else if (topic == "/state") {
			$('.state').empty();

			var state = message.toString();

			switch (state) {
				case "100":
					$('.view').removeClass("is-last");
					$('.view').removeClass("is-active");
					$('.view--welcome').addClass("is-active");
					break;
				case "200":
					$('.view--welcome').removeClass("is-active");
					$('.view--welcome').addClass("is-last");
					$('.view--level-setting').addClass("is-active");
					break;
				case "301":
					$('.view--welcome').removeClass("is-last");
					$('.view--level-setting').removeClass("is-active");
					$('.view--level-setting').addClass("is-last");
					$('.view--question-1').addClass("is-active");
					break;
				case "302":
					setTimeout(function() {
						$('.answer').empty();
						$('.view--level-setting').removeClass("is-last");
						$('.view--question-1').removeClass("is-active");
						$('.view--question-1').addClass("is-last");
						$('.view--question-2').addClass("is-active");
					}, slideDelay);
					break;
				case "303":
					setTimeout(function() {
						$('.answer').empty();
						$('.view--question-1').removeClass("is-last");
						$('.view--question-2').removeClass("is-active");
						$('.view--question-2').addClass("is-last");
						$('.view--question-3').addClass("is-active");
					}, slideDelay);
					break;
				case "304":
					setTimeout(function() {
						$('.answer').empty();
						$('.view--question-2').removeClass("is-last");
						$('.view--question-3').removeClass("is-active");
						$('.view--question-3').addClass("is-last");
						$('.view--question-4').addClass("is-active");
					}, slideDelay);
					break;
				case "400":
					setTimeout(function() {
						$('.answer').empty();
						$('.view--question-3').removeClass("is-last");
						$('.view--question-4').removeClass("is-active");
						$('.view--question-4').addClass("is-last");
						$('.view--results').addClass("is-active");
					}, slideDelay);
					break;
				case "500":
					$('.view--question-4').removeClass("is-last");
					$('.view--results').removeClass("is-active");
					$('.view--results').addClass("is-last");
					$('.view--done').addClass("is-active");
					break;
				default:
					$('.state').append("Error Yo");
			}
		} else if (topic == "/questions") {
			setTimeout(function() {
				$('.question').empty();
				$('.question').append(message.toString());
			}, slideDelay);
		} else if (topic == "/results") {
			$('.results').empty();
			$('.results').append(message.toString());
		} else if (topic == "/sounds") {
			var sound = message.toString();
			//yepSound.play();
			$('#sound-'+sound).get(0).play();
		} else if (topic == "/answer") {
			$('.answer').append(message.toString());
		} else {
			console.log('Nothing to do');
		}
	});

	$('#button').click(function() {
		client.publish('/browser', 'baeh');
	})
})
