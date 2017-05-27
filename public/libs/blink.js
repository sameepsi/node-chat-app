
var hold = "";

function blinkTitle(msg1, msg2, delay) {
        document.title = msg1;
        clearInterval(hold);
        hold = setInterval(function() {
            if (document.title == msg1) {
                document.title = msg2;
            } else {
                document.title = msg1;
            }
        }, delay);

}

function blinkTitleStop(text) {

    clearInterval(hold);
    document.title = text;

}
