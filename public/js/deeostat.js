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


var sensor1 = new TimeSeries();
var sensor2 = new TimeSeries();

function startSocket() {
	socket.on('data', function (data) {
		var sensorData = data;
		//var sensorData = JSON.parse(data);
		//console.log(sensorData.sensor1);
		temp.text(sensorData.sensors[0].value);

		sensor1.append(new Date().getTime(), sensorData.sensors[0].value);
		sensor2.append(new Date().getTime(), sensorData.sensors[1].value);

	});
}

function createTimeline() {
	var chart = new SmoothieChart();
	chart.addTimeSeries(sensor1, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 2 });
	chart.addTimeSeries(sensor2, { strokeStyle: 'rgba(255, 255, 0, 1)', fillStyle: 'rgba(255, 255, 0, 0.2)', lineWidth: 2 });
	chart.streamTo(document.getElementById("chart"), 500);
}
