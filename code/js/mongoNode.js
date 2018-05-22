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
            console.log("--resultado de la consulta: " + result);
            resultado = result.length == 0 ? false : true;
            resolve(resultado);
        });
    });

}

//funcion que mira si un usuario esta registrado
exports.consultarUsuarioRegistrado = function (nick, contr) {
    return new Promise(function (resolve, reject) {
        conexionMongo().var.connect(conexionMongo().direccion, function (err, db) {
            if (err) throw err;
            var dbo = db.db("projecte");
            consultaMongo(dbo, nick, contr).then(function (existe) {
                var myobj = { nickname: nick, contrasenya: contr };
                console.log("--usuario existe: " + existe);
                if (existe) {
                    dbo.collection("usuaris").find(myobj, function (err, res) {
                        if (err) throw err;
                        db.close();
                        console.log("--inicio de usuario correcto");
                        resolve(true);
                    });
                } else {
                    // io.emit('malIniciado');
                    console.log("--este usuario no esta registrado");
                    resolve(false);
                }
            }).catch(console.log);
        });
    });
}

//funcion que inserta objetos en mongodb
exports.insertarMongo = function (nick, contr) {
    //creamos nueva promesa
    return new Promise(function (resolve, reject) {
        //se crea la conexion con mongodb
        conexionMongo().var.connect(conexionMongo().direccion, function (err, db) {
            if (err) throw err;
            var dbo = db.db("projecte");
            //una vez hecha consulta se ejecuta la funcion
            consultaMongo(dbo, nick).then(function (existe) {
                var myobj = { nickname: nick, contrasenya: contr };
                if (!existe) {
                    dbo.collection("usuaris").insertOne(myobj, function (err, res) {
                        if (err) throw err;
                        console.log("--nuevo usuario registrado");
                        db.close();
                        //si se añadio correctamente, devolvemos un true
                        resolve(true);
                    });
                } else {
                    console.log("--este usuario ya existe");
                    //ejecutamos un metodo del lado cliente
                    // io.emit('nickExiste');
                    //si ya existe, devolvemos un false
                    resolve(false);
                }
            }).catch(console.log);
        });
    });
}