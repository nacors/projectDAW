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
    fondo;

var jugadoresImprimidos = new Map();
var idJugadoresImprimidos = [];
var idJugadoresNoMover = [];

var Game = {};

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
var quieto = true;
var countCon = 0;
var contadorTecla = 0;
var mostrarMensajeOculto = false;
var isFueraMapa = false;
var cont = 0;
<<<<<<< HEAD
var murcielagos = [];
=======
var bordeMapa = 849;
>>>>>>> 672faa88c445f2a6732d4613b38ac425b3f5aba6
Game.playerMap = new Map();


//FUNCIONES GAME---------------------------------------------------------------------------------------------------------------------------------
Game.addNewPlayer = function (id, x, y, jugadores, numMapa) {
    if (jugadoresImprimidos.size < 1) {
        miid = id;
        cargarMapa(numMapa);
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
    game.physics.p2.enable(jugador, true);
    //resizePolygon('ninja_physics', 'ninja_escalado', 'correr', 0.1);
    jugador.body.setRectangle(35, 58, -10, 22);
    //jugador.body.loadPolygon("ninja_escalado", "correr");
    jugador.body.fixedRotation = true;
    jugador.body.mass = 70;
    game.world.setBounds(0, 0, 6400, 900);
    if (id == miid) game.camera.follow(jugador);
    jugadoresImprimidos.set(id, g);
    idJugadoresImprimidos.push(id);
    textoEspera();
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
    cursors = game.input.keyboard.createCursorKeys();
    hit1 = game.input.keyboard.addKey(Phaser.Keyboard.C);
    hit2 = game.input.keyboard.addKey(Phaser.Keyboard.X);
    Client.askNewPlayer();
    game.physics.p2.setPostBroadphaseCallback(checkOverlap, this);

    //contador fps
    game.time.advancedTiming = true;
    //game.time.desiredFps = 30;
<<<<<<< HEAD
    var fondo = game.add.audio("fondo");
    fondo.loopFull(0.3);
=======
    // var fondo = game.add.audio("fondo");
    // fondo.loopFull(0.6);
>>>>>>> 672faa88c445f2a6732d4613b38ac425b3f5aba6
};

Game.update = function () {
    //solo permite movimiento
    if (sePuedeJugar) {
        if (jugadoresImprimidos.size != 0) {
            var data = {
                x: jugadoresImprimidos.get(miid).x,
                y: jugadoresImprimidos.get(miid).y
            };
            for (let jugador of idJugadoresImprimidos) {
                if (jugador != miid) {
                    jugadoresImprimidos.get(jugador).tint = 0xFF5252;
                }
            }
        }
        //movimiento para el personaje que controla el jugador
        if (cursors.left.isDown && quieto) {
            direccion = "left";
            Client.presionar(data, "izquierda");
            moverJugador(miid, "izquierda");
            movimientoFondo();
            revisarCaidoFueraMapa();
        } else if (cursors.right.isDown && quieto) {
            direccion = "right";
            Client.presionar(data, "derecha");
            moverJugador(miid, "derecha");
            movimientoFondo();
            revisarCaidoFueraMapa();
        } else if (quieto) {
            if (jugadoresImprimidos.size != 0) {
                Client.soltar(data);
                if (jugadoresImprimidos.has(miid)) {
                    jugadoresImprimidos.get(miid).body.velocity.x = 0;
                    jugadoresImprimidos.get(miid).animations.play('stay', 10, true);
                }
                revisarCaidoFueraMapa();
            }
        }
        if (cursors.up.isDown) {
            while (salto) {
                // console.log("pulsado");
                if (countSalto < 2) {
                    // console.log("saltando");
                    jugadoresImprimidos.get(miid).body.moveUp(1200);
                } else if (jugadoresImprimidos.get(miid).body.velocity.y < 14 && jugadoresImprimidos.get(miid).body.velocity.y > -14) {
                    countSalto = 0;
                }
                salto = false;
            }
            Client.presionar(data, "salto");
        } else if (cursors.up.isUp) {
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
            Client.ataque("hit1", direccion);
            pegar1(miid, direccion);
        } else if (hit2.isDown) {
            Client.ataque("hit2", direccion);
            pegar2(miid, direccion);
        }
    }
    //parte de easter egg
    easterEgg();
    reaparecerJugador();



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
        game.load.audio("fondo", `assets/sonidos/fondo/fondo1.wav`);
    }
    game.load.spritesheet('caballero', 'assets/imagenes/personajes/caballero.png', 90, 81);
    game.load.spritesheet('murcielago', 'assets/imagenes/murcielagos/murcielago.png', 32, 32);
    game.load.image("background", `assets/mapas/mapa${1}/fondo${1}.png`);
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
        } else if (direccion == "derecha") {
            jugadoresImprimidos.get(id).body.setRectangle(35, 58, -10, 22);
            jugadoresImprimidos.get(id).scale.setTo(1.3, 1.3);
            jugadoresImprimidos.get(id).animations.play('right', 10, true);
        } else if (direccion == "salto") {
            jugadoresImprimidos.get(id).animations.play('stay', 10, true);
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
    if (ataque == "hit1") {
        pegar1(id, direccion);
    } else if (ataque == "hit2") {
        pegar2(id, direccion);
    }
}

Game.opacityEnemigo = function (accion) {
    opacityJugador(accion);
}

Game.crearMurcielagos = function(direccion, y){
    var x;
    var sprite;
    var datosMurcielagos;
    var murcielagosDer = {
        0: [y+0, 600],
        1: [y+20, 500],
        2: [y+60, 700],
        3: [y+80, 400],
        4: [y+90, 600]
    }
    var murcielagosIzq = {
        0: [y+0, -600],
        1: [y+20, -500],
        2: [y+60, -700],
        3: [y+80, -400],
        4: [y+90, -600]
    }
    if(direccion == "derecha"){
        x = 50;
        sprite = [4,5,6,7];
        datosMurcielagos = murcielagosDer;
    }else{
        x = 6400;
        sprite = [12,13,14,15];
        datosMurcielagos = murcielagosIzq;
    }
    for(let i = 0; i < 5; i++){
        var murcielago = game.add.sprite(x, datosMurcielagos[i][0], 'murcielago');
        game.physics.p2.enable(murcielago, false);
        murcielago.body.kinematic = true;
        murcielago.body.velocity.x = datosMurcielagos[i][1];
        murcielago.animations.add('murcielagosmov', sprite, 60, true);
        murcielago.animations.play('murcielagosmov', 10, true);
        murcielagos.push(murcielago);
    }
    console.log(murcielagos);
}
game.state.add('Game', Game);
game.state.start('Game');


