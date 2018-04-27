var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
app.use('/css', express.static(__dirname + '/code/css'));
app.use('/js', express.static(__dirname + '/code/js'));
app.use('/assets', express.static(__dirname + '/media'));
server.listen(8080, function () {
  console.log('listening on *:8080');
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('newplayer', function () {
    console.log("Usuario nuevo");
  });
  socket.on('iniciarSesion', function(data){
    iniciarSesion(data)
  });
  socket.on('registrarse', registrarse);
  socket.on('jugarinvitado', jugarinvitado);
});

conexioMongo();

function iniciarSesion(data){
  console.log("Iniciar Sesion");
  console.log(data.nick);
  console.log(data.cont);
}

function registrarse(){
  console.log("registrarse");
}

function jugarinvitado(){
  console.log("jugarinvitado");
}

function conexioMongo() {
  var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

  // Connection URL
  var url = 'mongodb://localhost:27017/myproject';

  // Use connect method to connect to the server
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    db.close();
  });
}
