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

// Start HTTP/Express Server
var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

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
