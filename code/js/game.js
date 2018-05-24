//VARIABLES------------------------------------------------------------------------------------------------------------------------------------
var game = new Phaser.Game(1910, 900, Phaser.CANVAS, document.getElementById('game'));
var suelo,
    arboles,
    jugador1,
    cursors,
    hit1,
    mensaje,
    mensajeOculto,
    map,
    otromapa,
    posx, posy,
    direccion,
    frase,
    fondo,
    audioCaida,
    audioPocion,
    w,
    a,
    s,
    d,
    resultadoFinal,
    nombreJugador = null,
    nombreEnemigo = null,
    mensajePocion,
    mensajePocionEnemigo = null,
    musicaFondo;

var contSaltoVictoria = 50;
var jugadoresImprimidos = new Map();
var idJugadoresImprimidos = [];
var idJugadoresNoMover = [];

var Game = {};
var veceseEjecutado = 0;
var Timer = 0;
var salto = true;
var miid = 0;
var cantidadSalto = 0;
var sePuedeJugar = true;
var propiedadesTexto = {
    fill: "white",
    stroke: "black",
    fontSize: 40
};
var countSalto = 0;
var restartAnim = true;
var countCon = 0;
var contadorTecla = 0;
var mostrarMensajeOculto = false;
var isNingunaPocionaFuera = false;
var isFueraMapa = false;
var cont = 0;
var contPasos = 0;
var contEspada = 0;
var murcielagos = [];
var bordeMapa = 849;
var pociones = [];
var audioMurcielagos;
var direccionMurcielagos;
var sumarVelocidad = 0;
var sonidosSalto = [];
var flecha = null;
var direccionFlecha;
var moverFlecha = false;
var limitesMapa = {
    0: 0,
    1: 290,
    2: 2200,
    3: 4110,
    4: 4490,
};
var zonasReaparecion = {
    0: 995,
    1: 1285,
    2: 3200,
    3: 5065,
    4: 5445
};
var limiteActual = 2;
var limiteDerecha = limitesMapa[limiteActual] + 1910;
var miDireccion;
var direccionCamara;
var sePuedeReaparecer = false;
var pasoPlay = true;
var pegar = true;
var muertes = 0;
var bajas = 0;
var isPocionCogida = false;
var isPocionCogidaEnemigo = false;
var enemigoInmortal = false;
var sinColision = false;
Game.playerMap = new Map();


//FUNCIONES GAME---------------------------------------------------------------------------------------------------------------------------------
Game.addNewPlayer = function (id, x, y, jugadores, numMapa, pociones) {
    veceseEjecutado++;
    if (veceseEjecutado == 2) {
        enviarMiNombreUsuario();
    }
    //console.log(veceseEjecutado);
    //imprimios al jugador principal
    if (jugadoresImprimidos.size < 1) {
        miid = id;
        cargarMapa(numMapa, pociones);
    }
    let g = game.add.sprite(x, y, 'caballero');
    Game.playerMap.set(id, g);
    var jugador = Game.playerMap.get(id);
    jugador.name = (jugadoresImprimidos.size < 1) ? "yo" : "enemigo";
    jugador.anchor.setTo(0.5, 0.5);
    jugador.scale.setTo(1.3, 1.3);
    jugador.animations.add('right', [15, 16, 17, 18, 19], 60, true);
    jugador.animations.add('stay', [1, 2, 3, 4], 60, true);
    jugador.animations.add('hit1', [5, 6, 7, 8, 9, 10], 60, false);
    jugador.animations.add('hit2', [11, 12, 13, 14], 60, true);
    jugador.animations.play('stay', 10, true);
    game.physics.p2.enable(jugador, false);
    //resizePolygon('ninja_physics', 'ninja_escalado', 'correr', 0.1);
    jugador.body.setRectangle(35, 58, -10, 22);
    //jugador.body.loadPolygon("ninja_escalado", "correr");
    jugador.body.fixedRotation = true;
    jugador.body.mass = 70;
    game.world.setBounds(0, 0, 6400, 900);
    game.camera.x = limitesMapa[limiteActual];
    //console.log(game.world.bounds.left);
    jugador.body.collideWorldBounds = true;
    jugadoresImprimidos.set(id, g);
    idJugadoresImprimidos.push(id);
    textoEspera();
    //metemos el nombre de nuestro id antes de que se crean copiaso se impriman otros jugadores
    if (jugadoresImprimidos.size < 2) {
        añadirNombreUsuario();
        enviarMiNombreUsuario();
    }

    //enviamos el nombre del usuario a la pantalla enemiga
    //imprimimos los juagdores que no se muestran 
    //recorremos la array de jugadores que hemos pasado desde el servidor 
    //el servidor nos devuelve la array de todos los jugadores que se han conectado
    for (let player of jugadores) {
        //si el jugador no esta imprimido y id no coincide con actual, se crea un nuevo jugador (se evita que se impriman dobles)
        if (player.id != id && idJugadoresImprimidos.indexOf(player.id) == -1) {
            imprimirJugador(player);
        }
    }
};

Game.create = function () {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 5000;
    game.stage.backgroundColor = '#ccffff';
    w = game.input.keyboard.addKey(Phaser.Keyboard.W);
    a = game.input.keyboard.addKey(Phaser.Keyboard.A);
    s = game.input.keyboard.addKey(Phaser.Keyboard.S);
    d = game.input.keyboard.addKey(Phaser.Keyboard.D);
    cursors = game.input.keyboard.createCursorKeys();
    hit1 = game.input.keyboard.addKey(Phaser.Keyboard.K);
    hit2 = game.input.keyboard.addKey(Phaser.Keyboard.L);
    Client.askNewPlayer();
    game.physics.p2.setPostBroadphaseCallback(checkOverlap, this);

    //contador fps
    game.time.advancedTiming = true;
    //game.time.desiredFps = 30;
    musicaFondo = game.add.audio("fondo");
    audioMurcielagos = game.add.audio("audioMurcielagos");
    audioMurcielagos = game.add.audio("audioMurcielagos");
    for (let i = 1; i < 3; i++) {
        sonidosSalto.push(game.add.audio("salto" + i));
    }
    audioCaida = game.add.audio("caida");
    audioPocion = game.add.audio("pocion");
    musicaFondo.loopFull(0.6);
};

Game.update = function () {
    //solo permite movimiento
    if (sePuedeJugar) {
        if (jugadoresImprimidos.size != 0) {
            var data = {
                x: jugadoresImprimidos.get(miid).x,
                y: jugadoresImprimidos.get(miid).y
            };
            //damos color al personaje enemigo
            for (let jugador of idJugadoresImprimidos) {
                if (jugador != miid) {
                    jugadoresImprimidos.get(jugador).tint = 0xFF5252;
                }
            }
            //damos movimiento del jugador al personaje
            movimientoNombreJugador();
            movimientoNombreJugador("enemigo");
            // console.log("x: "+jugadoresImprimidos.get(miid).x);
            // console.log("y: "+jugadoresImprimidos.get(miid).y);
        }
        //movimiento para el personaje que controla el jugador
        if (a.isDown) {
            direccion = "left";
            Client.presionar(data, "izquierda");
            moverJugador(miid, "izquierda");
            movimientoFondo();
            revisarCaidoFueraMapa();
            limites();
            fixCamara();
            ganar();
        } else if (d.isDown) {
            direccion = "right";
            Client.presionar(data, "derecha");
            moverJugador(miid, "derecha");
            movimientoFondo();
            revisarCaidoFueraMapa();
            limites();
            fixCamara();
            ganar();
        } else {
            if (jugadoresImprimidos.size != 0) {
                if (jugadoresImprimidos.has(miid)) {
                    jugadoresImprimidos.get(miid).body.velocity.x = 0;
                    if (jugadoresImprimidos.get(miid).animations.currentAnim.name != "hit1" && jugadoresImprimidos.get(miid).animations.currentAnim.name != "hit2") {
                        Client.soltar(data);
                        jugadoresImprimidos.get(miid).animations.play('stay', 10, true);
                    }
                }
                revisarCaidoFueraMapa();
            }
        }
        if (w.isDown) {
            while (salto) {
                // console.log("pulsado");
                if (countSalto < 2) {
                    // console.log("saltando");
                    jugadoresImprimidos.get(miid).body.moveUp(1200);
                    sonidoSaltar();
                } else if (jugadoresImprimidos.get(miid).body.velocity.y < 14 && jugadoresImprimidos.get(miid).body.velocity.y > -14) {
                    countSalto = 0;
                }
                Client.presionar(data, "salto");
                salto = false;
            }

        } else if (w.isUp) {
            if (jugadoresImprimidos.get(miid) && jugadoresImprimidos.get(miid).body.velocity.y < 14 && jugadoresImprimidos.get(miid).body.velocity.y > -14) {
                countSalto = 0;
            }
            if (salto == false) {
                countSalto++;
                // console.log(countSalto);
            }
            salto = true;
        }
        if (hit1.isDown) {
            while (pegar) {
                Client.ataque("hit1", direccion);
                pegar1(miid, direccion);
                pegar = false;
                reproducirSonidosPegarAire();
            }
        } else if (hit2.isDown) {
            while (pegar) {
                Client.ataque("hit2", direccion);
                pegar2(miid, direccion);
                pegar = false;
                reproducirSonidosPegarAire();
            }
        }
        if (hit1.isUp && hit2.isUp) {
            pegar = true;
        }

    }else{
        if(resultadoFinal == "victoria"){
            saltosVictoria(jugadoresImprimidos.get(miid));
        }else if(resultadoFinal == "derrota"){
            saltosVictoria(jugadoresImprimidos.get(idJugadoresImprimidos[1]));
        }
    }
    //parte de easter egg
    easterEgg();
    reaparecerJugador();
    volverTransparenciaNormal();
    revisarPocionFueraMapa();
    murcielagosVolumen();
    posicionFlecha();
    //cont que sirve para reproducir correctamente los sonidos de los pasos
    contadorPasos();
    movimientoMensajePocionInmortalidad();
}

Game.render = function () {
    //game.debug.text(game.time.desiredFps, 2, 14, "black");
}

Game.init = function () {
    game.stage.disableVisibilityChange = true;
};

Game.preload = function () {
    //cargamos los dos mapas
    for (let numMapa = 1; numMapa < 3; numMapa++) {
        game.load.tilemap(`mapa${numMapa}`, `assets/mapas/mapa${numMapa}/elMapa${numMapa}.json`, null, Phaser.Tilemap.TILED_JSON);
        if (numMapa != 1) game.load.spritesheet(`tileset${numMapa}`, `assets/mapas/mapa${numMapa}/mapa${numMapa}.png`, 16, 16);
        else game.load.spritesheet(`tileset${numMapa}`, `assets/mapas/mapa${numMapa}/mapa${numMapa}.gif`, 16, 16);
    }
    game.load.audio("fondo", `assets/sonidos/fondo/fondo1.wav`);
    game.load.audio("salto1", `assets/sonidos/salto/salto1.mp3`);
    game.load.audio("salto2", `assets/sonidos/salto/salto2.mp3`);
    game.load.audio("paso1", `assets/sonidos/pasos/paso1.mp3`);
    game.load.audio("paso2", `assets/sonidos/pasos/paso2.mp3`);
    game.load.audio("paso3", `assets/sonidos/pasos/paso3.mp3`);
    game.load.audio("paso4", `assets/sonidos/pasos/paso4.mp3`);
    game.load.audio("paso5", `assets/sonidos/pasos/paso5.mp3`);
    game.load.audio("paso6", `assets/sonidos/pasos/paso6.mp3`);
    game.load.audio("paso7", `assets/sonidos/pasos/paso7.mp3`);
    game.load.audio("paso8", `assets/sonidos/pasos/paso8.mp3`);
    game.load.audio("audioMurcielagos", `assets/sonidos/murcielagos/murcielagos.mp3`);
    game.load.audio("caida", `assets/sonidos/salto/caida.wav`);
    game.load.audio("pocion", `assets/sonidos/pocion/pocion.wav`);
    game.load.spritesheet('caballero', 'assets/imagenes/personajes/caballero.png', 90, 81);
    game.load.spritesheet('murcielago', 'assets/imagenes/murcielagos/murcielago.png', 32, 32);
    game.load.spritesheet('fin', 'assets/imagenes/fin/victory_defeat.png', 264, 100);
    game.load.image("background", `assets/mapas/mapa${1}/fondo${1}.png`);
    game.load.image("pocion", `assets/imagenes/pociones/pocion.png`);
    game.load.image("flecha", `assets/imagenes/estilo/direccion.png`);
    game.load.audio("pegar1", `assets/sonidos/espada/espada1.mp3`);
    game.load.audio("pegar2", `assets/sonidos/espada/espada2.mp3`);
    game.load.audio("pegar3", `assets/sonidos/espada/espada3.mp3`);
    game.load.audio("pegar4", `assets/sonidos/espada/espada4.mp3`);
    game.load.audio("pegar5", `assets/sonidos/espada/espada6.mp3`);
    game.load.audio("pegar6", `assets/sonidos/espada/espada9.mp3`);
    game.load.audio("pegarAire2", `assets/sonidos/espada/espadaAire2.wav`);
    game.load.audio("pegarAire3", `assets/sonidos/espada/espadaAire3.wav`);
    game.load.audio("victoria", `assets/sonidos/victoria/musica_victoria.mp3`);
};

//movemos al jugadopr enemigo sincornizando los movimientos
Game.movimiento = function (id, data, accion, direccion) {
    //¿Porque se producia mal sincronizacion del personaje en el servidor ubuntu?
    //- Porque no reinciaba la variable de velocidad y, y el personaje tenia su propia velocidad y caia mas rapido de como lo hacia el jugador de verdad
    //- y se producian esos lagazos
    //le decimos al personaje enemigo controlado por otro jugador que no tenga sus propios movimientos
    jugadoresImprimidos.get(id).body.velocity.x = 0;
    jugadoresImprimidos.get(id).body.velocity.y = 0;
    //aqui le decimos que siga exactamente las x e y del jugador que lo controla
    jugadoresImprimidos.get(id).body.x = data.x;
    jugadoresImprimidos.get(id).body.y = data.y;
    //movimiento para los otros personajes
    //hay que tener en cuenta de que escuha constantemente los movimientos, tal vez es lo que mas carga el sistema
    if (accion == "presionar") {
        if (direccion == "izquierda") {
            jugadoresImprimidos.get(id).scale.setTo(-1.3, 1.3);
            jugadoresImprimidos.get(id).body.setRectangle(35, 58, 10, 22);
            jugadoresImprimidos.get(id).animations.play('right', 10, true);
            reproducirSonidosPasos();
        } else if (direccion == "derecha") {
            jugadoresImprimidos.get(id).body.setRectangle(35, 58, -10, 22);
            jugadoresImprimidos.get(id).scale.setTo(1.3, 1.3);
            jugadoresImprimidos.get(id).animations.play('right', 10, true);
            reproducirSonidosPasos();
        } else if (direccion == "salto") {
            jugadoresImprimidos.get(id).animations.play('stay', 10, true);
            //console.log(jugadoresImprimidos.get(miid).x - jugadoresImprimidos.get(id).x);
            if (jugadoresImprimidos.get(miid).x - jugadoresImprimidos.get(id).x < 1000
                && jugadoresImprimidos.get(miid).x - jugadoresImprimidos.get(id).x > -1000) {
                sonidosSalto[0].play();
            }
        }
    } else if (accion == "soltar") {
        if (jugadoresImprimidos.size != 0) {
            jugadoresImprimidos.get(id).animations.play('stay', 10, true);
        }
    }
}

Game.iniciarPartida = function () {
    propiedadesTexto.fontSize = 50;
    sePuedeJugar = false;
    var segundos = 2;
    var imprimirSegundos;
    setTimeout(function () {
        mensaje.setText("La partida empieza en...");
        imprimirSegundos = setInterval(function () {
            mensaje.setText(segundos);
            segundos--;
            if (segundos == -1) {
                iniciarPartida();
                mensaje.setText("");
                clearInterval(imprimirSegundos);
                sePuedeJugar = true;
            }
        }, 1000);
    }, 1000);

}

Game.ataqueEnemigo = function (id, ataque, direccion) {
    reproducirSonidosPegarAire();
    if (ataque == "hit1") {
        pegar1(id, direccion);
    } else if (ataque == "hit2") {
        pegar2(id, direccion);
    }
}

Game.opacityEnemigo = function (accion, move) {
    opacityJugador(accion, move);
}

Game.crearMurcielagos = function (direccion, y) {
    var x;
    var sprite;
    var datosMurcielagos;
    var murcielagosDer = {
        0: [y + 0, 600],
        1: [y + 20, 500],
        2: [y + 60, 700],
        3: [y + 80, 400],
        4: [y + 90, 600]
    }
    var murcielagosIzq = {
        0: [y + 0, -600],
        1: [y + 20, -500],
        2: [y + 60, -700],
        3: [y + 80, -400],
        4: [y + 90, -600]
    }
    direccionMurcielagos = direccion;
    /*if (direccion == "derecha") {
        x = 50;
        sprite = [4, 5, 6, 7];
        datosMurcielagos = murcielagosDer;
    } else {
        x = 6400;
        sprite = [12, 13, 14, 15];
        datosMurcielagos = murcielagosIzq;
    }
    for (let i = 0; i < 5; i++) {
        var murcielago = game.add.sprite(x, datosMurcielagos[i][0], 'murcielago');
        game.physics.p2.enable(murcielago, false);
        murcielago.body.kinematic = true;
        murcielago.body.velocity.x = datosMurcielagos[i][1];
        murcielago.animations.add('murcielagosmov', sprite, 60, true);
        murcielago.animations.play('murcielagosmov', 10, true);
        murcielagos.push(murcielago);
    }*/
    //console.log(murcielagos);
}

Game.nickEnemigo = function (nombre) {
    //console.log("imprimo el nombre del enemigo");
    if (idJugadoresImprimidos.length > 1) {
        nombreEnemigo = game.add.text(jugadoresImprimidos.get(idJugadoresImprimidos[1]).x, jugadoresImprimidos.get(idJugadoresImprimidos[1]).y - 20, nombre, {
            fill: "white",
            stroke: "black",
            fontSize: 15
        });
        nombreEnemigo.anchor.setTo(.5, .5);
    }
}

Game.pararCamara = function (posicion) {
    game.camera.target = null;
    game.camera.x = posicion;
}

Game.derrota = function (x, y) {
    derrota(x, y);
}
game.state.add('Game', Game);
game.state.start('Game');


