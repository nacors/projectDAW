var mongo = require(__dirname + '/code/js/mongoNode.js');
var funcion = require(__dirname + '/code/js/funcionesServer.js');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var path = require('path');
var accion = 1;
var jugadores = [];
server.lastPlayderID = 0;

app.use('/css', express.static(__dirname + '/code/css'));
app.use('/js', express.static(__dirname + '/code/js'));
app.use('/assets', express.static(__dirname + '/media'));
server.listen(8000, function () {
  console.log('listening on *:8000');
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

//funcion que redirecciona al juego
app.get('/juego', function (req, res) {
  funcion.linea();
  console.log("--redireccionamos al juego");
  res.sendFile(__dirname + '/pages/game.html')
});

//funcion que hace redirect al juego porque jugamos como invitado
app.get('/invitado', function (req, res) {
  linea();
  console.log("--jugamos como invitado");
  res.sendFile(__dirname + '/pages/game.html');
});

//funcion que nos registra
app.get('/registrar', function (req, res) {
  linea();
  console.log("--registramos un usuario nuevo");
  mongo.insertarMongo(req.query.nick, req.query.contr).then(function (registrado) {
    if (registrado) {
      //res.sendFile(__dirname + '/pages/game.html');
      res.json({ ok: true });
    } else {
      res.json({ ok: false });
    }
  });
});

//funcion que nos inica la sesion
app.get('/iniciar', function (req, res) {
  linea();
  console.log("--iniciamos sesion");
  mongo.consultarUsuarioRegistrado(req.query.nick, req.query.contr).then(function (existe) {
    if (existe) {
      // res.json({ruta:"http:www.google.es"});
      // res.send(__dirname + '/pages/game.html');
      res.json({ ok: true });
    } else {
      res.json({ ok: false });
    }
  });
});

//FUNCIONES DE MULTIJUGADOR
//funciones de peticion del lado cliente en el menu de incio
io.on('connection', function (socket) {
  //crea un jugador nuevo
  socket.on('newplayer', function () {
    linea();
    console.log("--usuario conectado al inicio");
    socket.player = {
      id: server.lastPlayderID++,
      x: server.lastPlayderID % 2 == 0 ? 300 : 100,
      y: 50
    };
    console.log(socket.player);
    //creamos una array de jugadores que guarda todos aquellos que se han conectado
    jugadores.push(socket.player);
    nuevoJugador(socket.player, jugadores);
    //al mover el personaje
    socket.on('disconnect', function () {
      linea();
      console.log("--usuario desconectado del inico");
    });   
  });
  //enviar moviemiento a los demas usuarios
  socket.on('presionar', function (movimiento){
    socket.broadcast.emit('presionar', socket.player.id, movimiento);
  });
  socket.on('soltar', function (movimiento){
    socket.broadcast.emit('soltar', socket.player.id, movimiento);
  });
  //reinicia todas las variables del jugador
  socket.on("matarConexiones", function () {
    console.log();
    jugadores = [];
    server.lastPlayderID = 0;
  });
});

//funciones del aldo cliente en el juego
io.on('connection', function (socket) {
  socket.on('usuarioJuego', function () {
    linea();
    console.log("--usuario conectado al juego");
    socket.on('disconnect', function () {
      linea();
      console.log("--usuario desconectado del juego");
    });
  });
});

//funcion que imprime lin ea separadora en la consola de server
function linea() {
  console.log("\n" + accion + ": ------------------------------");
  accion++;
}

//envia un array de jugadores y el jugador que se ha conectado al juego
function nuevoJugador(player, jugadores) {
  io.emit('newplayer', player, jugadores);
}



