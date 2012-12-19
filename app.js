var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

// Express config
var app = express();
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
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
var sensorArray = [tempSensor1, tempSensor2];

//setInterval(saveTestData, 1000);
function saveTestData() {
  tempSensor1.value = 65 + Math.random() * 2;
  tempSensor2.value = 65 + Math.random() * 4;
  var dp = new DataPoint({updated: new Date(), sensors: sensorArray});
  dp.save();
  console.log( tempSensor1.id, tempSensor1.value);
}

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
});

// // Twitter Config
// var twitter = require('ntwitter');
// var twit = new twitter({
//   consumer_key: 'DNycCs5umbkXvK8sLg4Pw',//'1n0oA2nMTMkoK78bWxMrZA',
//   consumer_secret: '5kteVzJOLanvvyxUwUcdpvfOePcdHEh3JwMPLQIpLc',//'yeUdrdMSZIWNxIHa0rM5Fzy9LaABIcbqbQSPjBqU7o',
//   access_token_key: '755692506-Fe9nHaveHZeO5ZcD52dagEXEErDZP01xxbP8XJXM',//'94417805-zhJxSJjVn5xMu6Vflcr3fjSAtqdD8Ybu71Tkd1kurc',
//   access_token_secret: 'KAxfZgZwsuju9tPMS125v3SrhavNMw1qpD7fOP0XIg'//'TQF1burLEBbVEJCSjarmt3bhGO9pkusYO1sU1kPjH1o'
// });

// function trackTwitterStream(keyword) { 
//   twit.stream('statuses/filter', { track: keyword, include_entities: true }, function(stream) {
//     stream.on('data', function (data) {
//       console.log(data);
//       io.sockets.emit('tweet', data);
//     });

//     stream.on('error', function (data) {
//       console.log(data);
//     });
//   });
// }

// function getTweets(req, res){
//   twit.search(TWITTER_KEYWORD + " -RT", {include_entities: true, rpp: "100"}, 
//     function(err, data) {
//       //console.log(data);
//       res.json(data);
//     }
//   );
// };

// trackTwitterStream(TWITTER_KEYWORD);
