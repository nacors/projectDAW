//VARIABLES------------------------------------------------------------------------------------------------------------------------------------
var suelo, arboles, jugador1, cursors, hit1;
var Timer = 0;
var salto = true;
var jugadoresImprimidos = new Map();
var idJugadoresImprimidos = [];
var game = new Phaser.Game(1920, 900, Phaser.AUTO, document.getElementById('game'));
var idContactoPermitido = [5, 6, 19];
var Game = {};
var miid = 0;
var mensaje;
var map;
var otromapa;
var posx, posy;
var cantidadSalto = 0;
var sePuedeJugar = true;
var propiedadesTexto = {
    fill: "white",
    stroke: "black",
    fontSize: 40
};
var quieto = true;
var direccion = "right";
var countCon = 0;
var numeroMapa = "hola";
Game.playerMap = new Map();


//FUNCIONES GAME---------------------------------------------------------------------------------------------------------------------------------
Game.addNewPlayer = function (id, x, y, jugadores, numMapa) {
    if (jugadoresImprimidos.size < 1) {
        miid = id;
        //dibujamos el mapa para el jugador
        map = game.add.tilemap(`mapa${numMapa}`);
        map.addTilesetImage('paisaje', `tileset${numMapa}`);
        nocolision = map.createLayer('nocolision');
        suelo = map.createLayer('suelo');
        doblesuelo = map.createLayer('doblesuelo');
        arboles = map.createLayer('arboles');
        map.setCollisionBetween(40, 216, true, suelo);
        map.setCollisionBetween(40, 216, true, doblesuelo);
        game.physics.p2.convertTilemap(map, suelo);
        game.physics.p2.convertTilemap(map, doblesuelo);
        countCon = 1;
    }

    let g = game.add.sprite(x, y, 'caballero');
    Game.playerMap.set(id, g);
    var jugador = Game.playerMap.get(id);
    jugador.anchor.setTo(0.5, 0.5);
    //jugador.scale.setTo(0.1, 0.1);
    jugador.animations.add('right', [15,16,17,18,19], 60, true);
    jugador.animations.add('stay', [1,2,3,4], 60, true);
    jugador.animations.add('hit1', [5,6,7,8,9,10], 60, false);
    jugador.animations.add('hit2', [11,12,13,14], 60, true);
    
    game.physics.p2.enable(jugador, true);
    //resizePolygon('ninja_physics', 'ninja_escalado', 'correr', 0.1);
    jugador.body.setRectangle(30, 47, -10, 18);
    //jugador.body.loadPolygon("ninja_escalado", "correr");
    jugador.body.fixedRotation = true;
    jugador.body.mass = 70;
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
};

Game.update = function () {
    //solo permite movimiento
    if (sePuedeJugar) {
        if (jugadoresImprimidos.size != 0) {
            var data = {
                x: jugadoresImprimidos.get(miid).x,
                y: jugadoresImprimidos.get(miid).y
            };
        }
        //movimiento para el personaje que controla el jugador
        if (cursors.left.isDown && quieto) {
            Client.presionar(data);
            direccion = "left";
            jugadoresImprimidos.get(miid).scale.setTo(-1,1);
            jugadoresImprimidos.get(miid).body.setRectangle(30, 47, 10, 18);
            jugadoresImprimidos.get(miid).body.moveLeft(700);
            jugadoresImprimidos.get(miid).animations.play('right', 10, true);
        } else if (cursors.right.isDown && quieto) {
            Client.presionar(data);
            direccion = "right";
            jugadoresImprimidos.get(miid).body.setRectangle(30, 47, -10, 18);
            jugadoresImprimidos.get(miid).scale.setTo(1,1);
            jugadoresImprimidos.get(miid).body.moveRight(700);
            jugadoresImprimidos.get(miid).animations.play('right', 10, true);
        } else if(quieto) {
            if (jugadoresImprimidos.size != 0) {
                Client.soltar(data);
                if (jugadoresImprimidos.has(miid)) {
                    jugadoresImprimidos.get(miid).body.velocity.x = 0;
                    jugadoresImprimidos.get(miid).animations.play('stay', 10, true);
                }
            }
        }
        if (cursors.up.isDown) {
            while (salto) {
                jugadoresImprimidos.get(miid).body.moveUp(1200);
                salto = false;
            }
            Client.presionar(data);
        } else if (cursors.up.isUp) {
            salto = true;
        }
        if (hit1.isDown){
            //Client.pegar(data,"hit1");
            jugadoresImprimidos.get(miid).body.velocity.x = 0;
            if(direccion == "right")jugadoresImprimidos.get(miid).body.setRectangle(60, 47, 5, 18);
            else jugadoresImprimidos.get(miid).body.setRectangle(60, 47, -5, 18);
            quieto = false;
            jugadoresImprimidos.get(miid).animations.play('hit1', 10, false);
            jugadoresImprimidos.get(miid).animations.currentAnim.onComplete.add(function () {	
                quieto = true;
                if(direccion == "right")jugadoresImprimidos.get(miid).body.setRectangle(30, 47, -10, 18);
                else jugadoresImprimidos.get(miid).body.setRectangle(30, 47, 10, 18);
            }, this);
        }
        if (hit2.isDown){
            jugadoresImprimidos.get(miid).body.velocity.x = 0;
            //Client.pegar(data,"hit1");
            if(direccion == "right")jugadoresImprimidos.get(miid).body.setRectangle(60, 47, 5, 18);
            else jugadoresImprimidos.get(miid).body.setRectangle(60, 47, -5, 18);
            quieto = false;
            quieto = false;
            jugadoresImprimidos.get(miid).animations.play('hit2', 10, false);
            jugadoresImprimidos.get(miid).animations.currentAnim.onComplete.add(function () {	
                quieto = true;
                if(direccion == "right")jugadoresImprimidos.get(miid).body.setRectangle(30, 47, -10, 18);
                else jugadoresImprimidos.get(miid).body.setRectangle(30, 47, 10, 18);
            }, this);
        }
    }

}

Game.render = function () {
}

Game.init = function () {
    game.stage.disableVisibilityChange = true;
};

Game.preload = function () {
    for (let numMapa = 1; numMapa < 4; numMapa++) {
        game.load.tilemap(`mapa${numMapa}`, `assets/mapas/mapa${numMapa}/elMapa${numMapa}.json`, null, Phaser.Tilemap.TILED_JSON);
        game.load.spritesheet(`tileset${numMapa}`, `assets/mapas/mapa${numMapa}/mapa${numMapa}.png`, 16, 16);
    }
    game.load.spritesheet('caballero', 'assets/imagenes/personajes/caballero.png', 90, 80);
};

Game.movimiento = function (id, data, accion) {
    //movimiento para los otros personajes
    //hay que tener en cuenta de que escuha constantemente los movimientos, tal vez es lo que mas carga el sistema
    if (accion == "presionar") {
        jugadoresImprimidos.get(id).body.x = data.x;
        jugadoresImprimidos.get(id).body.y = data.y;
        jugadoresImprimidos.get(id).animations.play('right', 10, true);
    } else if (accion == "soltar") {
        if (jugadoresImprimidos.size != 0) {
            jugadoresImprimidos.get(id).body.x = data.x;
            jugadoresImprimidos.get(id).body.y = data.y;
            jugadoresImprimidos.get(id).body.velocity.x = 0;
            jugadoresImprimidos.get(id).animations.play('stay', 10, true);
        }
    }
}

Game.iniciarPartida = function () {
    propiedadesTexto.fontSize = 50;
    sePuedeJugar = false;
    var segundos = 3;
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

game.state.add('Game', Game);
game.state.start('Game');


