var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
// app.use('/css', express.static(__dirname + '/code'));
// app.use('/js', express.static(__dirname + '/code'));
// app.use('/assets', express.static(__dirname + '/media'));
server.listen(3000, function(){
  console.log('listening on *:3000');
});
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', function (socket) { console.log("usuari connectat") });
server.listen(3000);