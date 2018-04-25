var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
app.get('/', function (req, res) {
    res.render('index', {});
  });
io.on('connection', function(){ console.log("Hola") });
server.listen(3000);