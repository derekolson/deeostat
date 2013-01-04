var express = require('express')
  , routes = require('./routes')
  , http = require('http');




// Express config
var app = express();
app.configure(function(){
  app.set('port', process.env.PORT || 5000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.get('/', routes.index);
app.get('/data', getData);

// Start HTTP/Express Server
var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

//MongoDB - MongoLab Connection
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://heroku_app10177423:2h1vr7kbpnkteponseavatndhd@ds045637.mongolab.com:45637/heroku_app10177423');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("MongoLab Connected");
});


var SensorSchema = mongoose.Schema({
  _id: String,
  type: String,
  name: String,
  value: Number
});

var DataPointSchema = mongoose.Schema({
  updated: { type: Date, default: Date.now },
  sensors: [SensorSchema]
});

var Sensor = mongoose.model('Sensor', SensorSchema);
var DataPoint = mongoose.model('DataPoint', DataPointSchema);

var tempSensor1 = new Sensor({_id: "0", type: "TEMP", name: "Temp Sensor 1", value: 0});
var tempSensor2 = new Sensor({_id: "1", type: "TEMP", name: "Temp Sensor 2", value: 0});
var sensorArray = [tempSensor1];

// function getTemperature() {
//   http.get("http://10.10.1.250/sensor", function(res) {
//     res.on('data', function (chunk) {
//       console.log(''+chunk);
//     });
//   });
// }


function getData(req, res) {
  DataPoint.find().sort('-updated').exec(function (arr,data) {
    res.send(data);
  });
}


// Socket.io config
var io = require('socket.io').listen(server);

io.configure(function () { 
  io.set('transports', ['xhr-polling']); 
  io.set('polling duration', 10);
  io.set('log level', 1);
});

io.sockets.on('connection', function (socket) {
  console.log('socket connected');

  socket.on('disconnect', function () {
    console.log('socket disconnected');
  });

  
});

var sensorSocket = io
  .of('/sensor')
  .on('connection', function (socket) {
    console.log('sensor connected');
    socket.on('data', updateData);
    socket.on('disconnect', function () {
      console.log('sensor disconnected');
    });
  });

var ioclient = require('socket.io-client');
var socket = ioclient.connect('http://localhost:8080', {reconnect: true});
socket.on('data', updateData);

var prevTime = 0;
function updateData(data) {
  tempSensor1.value = data.sensors[0].value;
  tempSensor2.value = data.sensors[1].value;
  io.sockets.emit('data', data);

  var currentTime = new Date();
  if(currentTime - prevTime > 10000) {
    prevTime = currentTime;
    var dp = new DataPoint({sensors: sensorArray});
    dp.save();
    console.log("Updated DB");
  }
}