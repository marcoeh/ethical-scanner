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
		question4,
		question1IsSet = false,
		question2IsSet = false,
		question3IsSet = false,
		question4IsSet = false;

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
					$('.ethic-level-setting__dot').css( "left", "0%" );
					break;
				case "2":
					$('.ethic-level-setting__dot').css( "left", "33.3%" );
					break;
				case "3":
					$('.ethic-level-setting__dot').css( "left", "66.6%" );
					break;
				case "4":
					$('.ethic-level-setting__dot').css( "left", "100%" );
					break;
				default:
					console.log("ethicLevel Error");
			}


			// switch (ethicLevel) {
			// 	case "1":
			// 		$('.ethic-level-setting__dot-wrapper').removeClass("is-selected");
			// 		$('.ethic-level-setting__dot-wrapper--1').addClass("is-selected");
			// 		break;
			// 	case "2":
			// 		$('.ethic-level-setting__dot-wrapper').removeClass("is-selected");
			// 		$('.ethic-level-setting__dot-wrapper--2').addClass("is-selected");
			// 		break;
			// 	case "3":
			// 		$('.ethic-level-setting__dot-wrapper').removeClass("is-selected");
			// 		$('.ethic-level-setting__dot-wrapper--3').addClass("is-selected");
			// 		break;
			// 	case "4":
			// 		$('.ethic-level-setting__dot-wrapper').removeClass("is-selected");
			// 		$('.ethic-level-setting__dot-wrapper--4').addClass("is-selected");
			// 		break;
			// 	default:
			// 		console.log("ethicLevel Error");
			// }
		} else if (topic == "/state") {
			$('.state').empty();

			state = message.toString();

			switch (state) {
				case "100":
					/* Do some resets */
					question1IsSet = false;
					question2IsSet = false;
					question3IsSet = false;
					question4IsSet = false;

					$('.view__question-static-status-bar').css( "width", "0%" );
					$('.letter__wrapper').removeClass("is-printing");
					$('.letter__questions').empty();
					$('.letter').addClass("is-small");
					$('.question__content').empty();
					$('.question').removeClass("is-animating-yes");
					$('.question').removeClass("is-animating-no");

					$('.letter__date-today').empty();
					todaysDate = moment().locale("de").format("DD. MMMM YYYY");;
					$('.letter__date-today').append(todaysDate);

					/* Activate first view */
					$('.view--welcome').addClass("is-active");

					break;
				case "200":
					setTimeout(function() {
						$('.view--welcome').removeClass("is-active");
					}, 600);
					setTimeout(function() {
						$('.view--level-setting').addClass("is-active");
					}, 1200);
					break;
				case "301":
					$('.view__question-static-info-question-nr').empty();
					$('.view__question-static-info-question-nr').append("1");

					$('.view--level-setting').removeClass("is-active");

					setTimeout(function() {
						$('.view--question').addClass("is-active");
						$('.view--letter').addClass("is-visible");
						$('.view__question-static-content').addClass("is-visible");
						$('.view__question-static-status-bar').css( "width", "25%" );
					}, 600);

					setTimeout(function() {
						$('.question--1').addClass("is-active");
					}, 1000);

					break;
				case "302":
					setTimeout(function() {
						$('.view__question-static-info-question-nr').empty();
						$('.view__question-static-info-question-nr').append("2");

						$('.view__question-static-status-bar').css( "width", "50%" );

						$('.question--1').removeClass("is-active");
						$('.question--2').addClass("is-active");

					}, slideDelay);
					break;
				case "303":
					setTimeout(function() {
						$('.view__question-static-info-question-nr').empty();
						$('.view__question-static-info-question-nr').append("3");

						$('.view__question-static-status-bar').css( "width", "75%" );

						$('.question--2').removeClass("is-active");
						$('.question--3').addClass("is-active");

					}, slideDelay);
					break;
				case "304":
					setTimeout(function() {
						$('.view__question-static-info-question-nr').empty();
						$('.view__question-static-info-question-nr').append("4");

						$('.view__question-static-status-bar').css( "width", "100%" );

						$('.question--3').removeClass("is-active");
						$('.question--4').addClass("is-active");

					}, slideDelay);
					break;
				case "400":
					setTimeout(function() {

						$('.view__question-static-content').removeClass("is-visible");
						$('.question--4').removeClass("is-active");
						$('.letter').removeClass("is-small");

						$('.letter__call-to-print').addClass("is-visible");

						$('.view--question').removeClass("is-active");
					}, slideDelay);
					break;
				case "500":
					$('.letter__call-to-print').removeClass("is-visible");

					$('.letter__wrapper').addClass("is-printing");

					setTimeout(function() {
						$('.view--letter').removeClass("is-visible");
					}, 2000);

					break;
				case "sorry":
					$('.view').addClass("is-shaking");
					setTimeout(function() {
						$('.view').removeClass("is-shaking");
					}, 300);
					break;
				default:
					$('.state').append("Error Yo");
			}
		} else if (topic == "/questions") {
			switch (state) {
				case "301":
					if (!question1IsSet) {
						question1 = message.toString();
						$('.question__content--1').append(question1);
						question1IsSet = true;
					}
					break;
				case "302":
					if (!question2IsSet) {
						question2 = message.toString();
						$('.question__content--2').append(question2);
							question2IsSet = true;
					}
					break;
				case "303":
					if (!question3IsSet) {
						question3 = message.toString();
						$('.question__content--3').append(question3);
						question3IsSet = true;
					}
					break;
				case "304":
					if (!question4IsSet) {
						question4 = message.toString();
						$('.question__content--4').append(question4);
						question4IsSet = true;
					}
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

			var answer = message.toString(),
				animationDurationQuestion = 600,
				typeSpeed = -100;

			switch (state) {
				case "301":
					if (answer == "Yes") {
						$('.question--1').addClass("is-animating-yes");
						$('.letter__questions').append('<li class="letter__question letter__question--1"></li>');
						setTimeout(function() {
							$('.letter__question--1').typed({
								strings: [question1],
								showCursor: false,
								typeSpeed: typeSpeed
							});
						}, animationDurationQuestion);
					} else {
						$('.question--1').addClass("is-animating-no");
					}
					break;
				case "302":
					if (answer == "Yes") {
						$('.question--2').addClass("is-animating-yes");
						$('.letter__questions').append('<li class="letter__question letter__question--2"></li>');
						setTimeout(function() {
							$('.letter__question--2').typed({
								strings: [question2],
								showCursor: false,
								typeSpeed: typeSpeed
							});
						}, animationDurationQuestion);
					} else {
						$('.question--2').addClass("is-animating-no");
					}
					break;
				case "303":
					if (answer == "Yes") {
						$('.question--3').addClass("is-animating-yes");
						$('.letter__questions').append('<li class="letter__question letter__question--3"></li>');
						setTimeout(function() {
							$('.letter__question--3').typed({
								strings: [question3],
								showCursor: false,
								typeSpeed: typeSpeed
							});
						}, animationDurationQuestion);
					} else {
						$('.question--3').addClass("is-animating-no");
					}
					break;
				case "304":
					if (answer == "Yes") {
						$('.question--4').addClass("is-animating-yes");
						$('.letter__questions').append('<li class="letter__question letter__question--4"></li>');
						setTimeout(function() {
							$('.letter__question--4').typed({
								strings: [question4],
								showCursor: false,
								typeSpeed: typeSpeed
							});
						}, animationDurationQuestion);
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
