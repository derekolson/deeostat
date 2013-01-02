var io = require('socket.io-client');
var socket = io.connect('http://localhost:5000', {reconnect: true});

// // Socket.io config
// var io = require('socket.io').listen(8080);

// io.configure(function () { 
//   //io.set('transports', ['xhr-polling']); 
//   //io.set('polling duration', 10);
//   io.set('log level', 1);
// });

// io.sockets.on('connection', function (socket) {
//   console.log('socket connected');
// });

// Serial Port
var serial = require('serialport');
var SerialPort = serial.SerialPort;

var myPort = new SerialPort("/dev/tty.usbserial-A100ROB5", { 
  parser: serial.parsers.readline("\n")
});

var serialData, connectInterval;

function startSerialPort() {

  myPort.on('data', function (data) {
    clearInterval(connectInterval);
    
    serialData = JSON.parse(data);
    
    // io.sockets.emit('data', serialData);
    socket.emit('data', serialData);
    //console.log(serialData);
  });

  myPort.flush();
  connectInterval = setInterval(function(){ myPort.write('c') }, 500);
}

process.on('SIGINT', function () {
  console.log(' - Sending Exit Signal');
  myPort.flush();
  myPort.write('x');
  process.exit();
});

startSerialPort();