// run this function when the document has loaded
$(function() {
    var client = mqtt.connect('mqtt://86241baa:660d67a40f0bfa38@broker.shiftr.io', {
        clientId: 'browser'
    });

    client.on('connect', function() {
        console.log('client has connected!');

        client.subscribe('/state');
        client.subscribe('/ethic-level');
        client.subscribe('/questions');
        client.subscribe('/question-nr');
        client.subscribe('/results');
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
                    $('.view--level-setting').removeClass("is-last");
                    $('.view--question-1').removeClass("is-active");
                    $('.view--question-1').addClass("is-last");
                    $('.view--question-2').addClass("is-active");
                    break;
                case "303":
                    $('.view--question-1').removeClass("is-last");
                    $('.view--question-2').removeClass("is-active");
                    $('.view--question-2').addClass("is-last");
                    $('.view--question-3').addClass("is-active");
                    break;
                case "304":
                    $('.view--question-2').removeClass("is-last");
                    $('.view--question-3').removeClass("is-active");
                    $('.view--question-3').addClass("is-last");
                    $('.view--question-4').addClass("is-active");
                    break;
                case "400":
                    $('.view--question-3').removeClass("is-last");
                    $('.view--question-4').removeClass("is-active");
                    $('.view--question-4').addClass("is-last");
                    $('.view--results').addClass("is-active");
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
            $('.question').empty();
            $('.question').append(message.toString());
        } else if (topic == "/results") {
            $('.results').append(message.toString());
        } else {
            console.log('Nothing to do');
        }
    });

    $('#button').click(function() {
        client.publish('/browser', 'baeh');
    })
})
