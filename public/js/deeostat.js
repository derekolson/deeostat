var socket = io.connect("/");

$(document).ready(init);
	
function init() {
	startSocket();
	$(window).resize(onResize);
}

function onResize(){

}

function startSocket() {
	// socket.on('tweet', function (data) {
	// 	onNewTweet(data);
	// });
}
