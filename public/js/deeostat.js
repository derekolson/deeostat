var socket = io.connect("/");
var temp;
$(document).ready(init);

function init() {
	temp = $("#temp");
	createTimeline();

	startSocket();
	$(window).resize(onResize);
}

function onResize(){

}


var sensors = new TimeSeries();

function startSocket() {
	socket.on('data', function (data) {
		var sensorData = data;
		//var sensorData = JSON.parse(data);
		console.log(sensorData.sensor1);
		temp.text(sensorData.sensor1);

		sensors.append(new Date().getTime(), sensorData.sensor1);

	});
}

function createTimeline() {
	var chart = new SmoothieChart();
	chart.addTimeSeries(sensors, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 2 });
	chart.streamTo(document.getElementById("chart"), 500);
}
