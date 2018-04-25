var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
app.use('/css',express.static(__dirname + '/code/css'));
app.use('/js',express.static(__dirname + '/code/js'));
app.use('/assets',express.static(__dirname + '/media'));
app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
});
io.on('connection', function(){ console.log("Hola") });
server.listen(3000);