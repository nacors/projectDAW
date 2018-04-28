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

//******************FUNCIONES PERSONALES******************//
//funcion que hace redirect al juego porque jugamos como invitado
app.get('/invitado', function (req, res) {
  console.log("**********************************");
  console.log("jugamos como invitado");
  res.sendFile(__dirname + '/pages/game.html');
});

//funcion que nos registra
app.get('/registrar', function (req, res) {
  console.log("**********************************");
  console.log("registramos un usuario nuevo");
  if(insertarMongo(req.query.usernameR, req.query.passwordR)){
    res.sendFile(__dirname + '/pages/game.html');
  }
});

//funcion que nos inica la sesion
app.get('/iniciar', function (req, res) {
  console.log("**********************************");
  console.log("iniciamos sesion");
  if(consultarUsuarioRegistrado(req.query.usernameR, req.query.passwordR)){
    res.sendFile(__dirname + '/pages/game.html');
  }
});

//funciones de peticion del lado cliente
io.on('connection', function (socket) {
  socket.on('newplayer', function () {
    console.log("Usuario nuevo");
  });
  //funciones que se usaran para las llamadas del cliente la servidor
  // socket.on('iniciarSesion', iniciarSesion);
  // socket.on('registrarse', registrarse);
  // socket.on('jugarinvitado', jugarinvitado);
});

//******************FUNCIONES DE MONGO******************//
function conexioMongo() {
  var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
  // Connection URL
  var url = 'mongodb://localhost:27017/projecte';
  // Use connect method to connect to the server
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
  });
}

//funcion que realiza la conexion al mongo
function conexionMongo() {
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";
  return { var: MongoClient, direccion: url };
}

//funcion de consulta al mongo
function consultaMongo(dbo, nick, contr = false) {
  var query;
  //si no hay contraseña es la consulta de registro
  if (!contr) {
    query = { nickname: nick };
    //si hay contraseña es una consulta que verifica si el usuario esta registrado
  } else {
    query = { nickname: nick, contrasenya: contr };
  }
  return new Promise(function (resolve, reject) {
    dbo.collection("usuaris").find(query).toArray(function (err, result) {
      if (err) throw err;
      resultado = result.length == 0 ? false : true;
      resolve(resultado);
    });
  });

}

//funcion que mira si un usuario esta registrado
function consultarUsuarioRegistrado(nick, contr) {
  conexionMongo().var.connect(conexionMongo().direccion, function (err, db) {
    if (err) throw err;
    var dbo = db.db("projecte");
    consultaMongo(dbo, nick, contr).then(function (existe) {
      var myobj = { nickname: nick, contrasenya: contr };
      if (existe) {
        dbo.collection("usuaris").insertOne(myobj, function (err, res) {
          if (err) throw err;
          redireccionarJuego();
          db.close();
          return true;
        });
      } else {
        console.log("este usuario no esta registrado");
        io.emit('malIniciado');
        return false;
      }
    }).catch(console.log);
  });
}

//funcion que inserta objetos en mongodb
function insertarMongo(nick, contr) {
  conexionMongo().var.connect(conexionMongo().direccion, function (err, db) {
    if (err) throw err;
    var dbo = db.db("projecte");
    consultaMongo(dbo, nick).then(function (existe) {
      var myobj = { nickname: nick, contrasenya: contr };
      if (!existe) {
        dbo.collection("usuaris").insertOne(myobj, function (err, res) {
          if (err) throw err;
          console.log("nou usuari registrat");
          redireccionarJuego();
          db.close();
          return true;
        });
      } else {
        console.log("este usuario ya existe");
        io.emit('nickExiste');
        return false;
      }
    }).catch(console.log);
  });
}

