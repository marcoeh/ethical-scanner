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
    });

    client.on('message', function(topic, message) {
        console.log('new message:', topic, message.toString());

        if (topic == "/ethic-level") {
            $('.ethic-level-number').empty();
            $('.ethic-level-number').append(message.toString());
        } else if (topic == "/state") {
            $('.state').empty();

            var state = message.toString();

            switch (state) {
                case "100":
                    $('.question').empty();
                    $('.question').append("Hello there, please scan.");
                    $('.state-dot').removeClass("is-active");
                    break;
                case "200":
                    $('.question').empty();
                    $('.question').append("You scanned the Product XY. Please set your ethic level.");
                    break;
                case "301":
                    $('.question').empty();
                    $('#state-dot-1').addClass("is-active");
                    break;
                case "302":
                    $('#state-dot-2').addClass("is-active");
                    break;
                case "303":
                    $('#state-dot-3').addClass("is-active");
                    break;
                case "304":
                    $('#state-dot-4').addClass("is-active");
                    break;
                case "400":
                    $('.question').empty();
                    $('.question').append("Your Results are: TODO");
                    break;
                case "500":
                    $('.question').empty();
                    $('.question').append("Done. Restart?");
                    break;
                default:
                    $('.state').append("Error Yo");
            }

        } else if (topic == "/questions") {
            $('.question').empty();
            $('.question').append(message.toString());
        } else {
            console.log('Nothing to do');
        }
    });

    $('#button').click(function() {
        client.publish('/browser', 'baeh');
    })
})
