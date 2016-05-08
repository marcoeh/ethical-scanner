// run this function when the document has loaded
$(function() {

	var client = mqtt.connect('mqtt://86241baa:660d67a40f0bfa38@broker.shiftr.io', {
		clientId: 'browser'
	});

	var slideDelay = 800,
		state,
		todaysDate,
		question1,
		question2,
		question3,
		question4;

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

			state = message.toString();

			switch (state) {
				case "100":
					$('.view--welcome').addClass("is-active");
					$('.view__question-static-status-bar').css( "width", "0%" );

					$('.view__question-static-call-to-answer').removeClass("is-visible");

					$('.letter__questions').empty();
					$('.letter').addClass("is-small");
					$('.question').empty();
					$('.question').removeClass("is-animating-yes");
					$('.question').removeClass("is-animating-no");

					$('.letter__date-today').empty();
					todaysDate = moment().locale("de").format("DD. MMMM YYYY");;
					$('.letter__date-today').append(todaysDate);
					break;
				case "200":
					$('.view--done').removeClass("is-last");
					$('.view--welcome').removeClass("is-active");
					$('.view--welcome').addClass("is-last");
					$('.view--level-setting').addClass("is-active");
					break;
				case "301":
					$('.view--welcome').removeClass("is-last");
					$('.view--level-setting').removeClass("is-active");
					$('.view--level-setting').addClass("is-last");
					$('.view--question').addClass("is-active");
					$('.view__question-static-content').addClass("is-visible");
					$('.view__question-static-status-bar').css( "width", "25%" );
					$('.view__question-static-call-to-answer').addClass("is-visible");

					$('.view__letter').addClass("is-visible");

					$('.question--1').addClass("is-active");
					break;
				case "302":
					setTimeout(function() {
						$('.view--level-setting').removeClass("is-last");
						$('.view__question-static-status-bar').css( "width", "50%" );

						$('.question--1').removeClass("is-active");
						$('.question--2').addClass("is-active");

					}, slideDelay);
					break;
				case "303":
					setTimeout(function() {
						$('.view__question-static-status-bar').css( "width", "75%" );

						$('.question--2').removeClass("is-active");
						$('.question--3').addClass("is-active");

					}, slideDelay);
					break;
				case "304":
					setTimeout(function() {
						$('.view__question-static-status-bar').css( "width", "100%" );

						$('.question--3').removeClass("is-active");
						$('.question--4').addClass("is-active");

					}, slideDelay);
					break;
				case "400":
					$('.view__question-static-content').removeClass("is-visible");
					$('.question--4').removeClass("is-active");
					$('.letter').removeClass("is-small");

					$('.view--level-setting').removeClass("is-last");
					$('.view--question').removeClass("is-active");
					$('.view--question').addClass("is-last");
					break;
				case "500":
					$('.view__letter').removeClass("is-visible");

					$('.view--question').removeClass("is-last");
					break;
				default:
					$('.state').append("Error Yo");
			}
		} else if (topic == "/questions") {
			switch (state) {
				case "301":
					question1 = message.toString();
					$('.question--1').append(question1);
					break;
				case "302":
					question2 = message.toString();
					$('.question--2').append(question2);
					break;
				case "303":
					question3 = message.toString();
					$('.question--3').append(question3);
					break;
				case "304":
					question4 = message.toString();
					$('.question--4').append(question4);
					break;
				default:
					$('.question').append("Error Yo");
			}
		} else if (topic == "/results") {
			$('.results').empty();
			$('.results').append(message.toString());
		} else if (topic == "/sounds") {
			var sound = message.toString();
			//yepSound.play();
			$('#sound-'+sound).get(0).play();
		} else if (topic == "/answer") {

			var answer = message.toString();

			switch (state) {
				case "301":
					if (answer == "Yes") {
						$('.question--1').addClass("is-animating-yes");
						$('.letter__questions').append('<p class="letter__question letter__question--1"></p>');
						$('.letter__question--1').typed({
							strings: [question1],
							showCursor: false,
							typeSpeed: -80
						});
					} else {
						$('.question--1').addClass("is-animating-no");
					}
					break;
				case "302":
					if (answer == "Yes") {
						$('.question--2').addClass("is-animating-yes");
						$('.letter__questions').append('<p class="letter__question letter__question--2"></p>');
						$('.letter__question--2').typed({
							strings: [question2],
							showCursor: false,
							typeSpeed: -80
						});
					} else {
						$('.question--2').addClass("is-animating-no");
					}
					break;
				case "303":
					if (answer == "Yes") {
						$('.question--3').addClass("is-animating-yes");
						$('.letter__questions').append('<p class="letter__question letter__question--3"></p>');
						$('.letter__question--3').typed({
							strings: [question3],
							showCursor: false,
							typeSpeed: -80
						});
					} else {
						$('.question--3').addClass("is-animating-no");
					}
					break;
				case "304":
					if (answer == "Yes") {
						$('.question--4').addClass("is-animating-yes");
						$('.letter__questions').append('<p class="letter__question letter__question--4"></p>');
						$('.letter__question--4').typed({
							strings: [question4],
							showCursor: false,
							typeSpeed: -80
						});
					} else {
						$('.question--4').addClass("is-animating-no");
					}
					break;
				default:
			}
		} else {
			console.log('Nothing to do');
		}
	});

	$('#button').click(function() {
		client.publish('/browser', 'baeh');
	})
})
