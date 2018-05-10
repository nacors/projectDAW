//VARIABLES------------------------------------------------------------------------------------------------------------------------------------
var suelo, arboles, jugador1, cursors, jumpButton;
var jumpTimer = 0;
var salto = true;
var jugadoresImprimidos = new Map();
var idJugadoresImprimidos = [];
var game = new Phaser.Game(1920, 900, Phaser.AUTO, document.getElementById('game'));
// console.log(window.innerWidth);
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
var numeroMapa = "hola";
Game.playerMap = new Map();


//FUNCIONES GAME---------------------------------------------------------------------------------------------------------------------------------
Game.addNewPlayer = function (id, x, y, jugadores, numMapa) {
    // if(isNaN(numeroMapa)){

    //     Game.create();
    // }
    console.log("ejecuto add new player");
    if (jugadoresImprimidos.size < 1) {
        miid = id;
    }
    // console.log("Imprimimos jugador -----------------------------");
    // console.log("Imprimimos jugador: " + id);
    let g = game.add.sprite(x, y, 'ninja');
    Game.playerMap.set(id, g);
    var jugador = Game.playerMap.get(id);
    jugador.anchor.setTo(0.5, 0.5);
    jugador.scale.setTo(0.1, 0.1);
    jugador.animations.add('right');
    game.physics.p2.enable(jugador, true);
    resizePolygon('ninja_physics', 'ninja_escalado', 'correr', 0.1);
    jugador.body.clearShapes();
    jugador.body.loadPolygon("ninja_escalado", "correr");
    jugador.body.fixedRotation = true;
    jugador.body.mass = 70;
    // game.camera.follow(jugador, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    //hacemos al personaje inmovible
    // jugador.body.immovable = true;
    // jugador.body.moves = false;


    //game.camera.follow(jugador);
    //game.world.setBounds(0, 0, 2100, 990);
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
    // console.log("MI MAP de jugadores ES: ****************************");
    // console.log(jugadoresImprimidos);
    // Client.pedirNumeroAleatorio();
};

Game.create = function () {
    console.log("ejecuto create");
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 5000;
    game.stage.backgroundColor = '#ccffff';
    map = game.add.tilemap('map');
    map.addTilesetImage('paisaje', 'tileset');
   
    nocolision = map.createLayer('nocolision');
    suelo = map.createLayer('suelo');
    doblesuelo = map.createLayer('doblesuelo');
    arboles = map.createLayer('arboles');
    map.setCollisionBetween(40, 216, true, suelo);
    map.setCollisionBetween(40, 216, true, doblesuelo);
    game.physics.p2.convertTilemap(map, suelo);
    game.physics.p2.convertTilemap(map, doblesuelo);
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    

    //coliisones
    game.physics.p2.setPostBroadphaseCallback(checkOverlap, this);

    // game.state.add('mapa1', mapa1);
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
        if (cursors.left.isDown) {
            Client.presionar(data);
            jugadoresImprimidos.get(miid).body.moveLeft(700);
            jugadoresImprimidos.get(miid).animations.play('right', 10, true);
        } else if (cursors.right.isDown) {
            Client.presionar(data);
            jugadoresImprimidos.get(miid).body.moveRight(700);
            jugadoresImprimidos.get(miid).animations.play('right', 10, true);
        } else {
            if (jugadoresImprimidos.size != 0) {
                Client.soltar(data);
                if (jugadoresImprimidos.has(miid)) {
                    jugadoresImprimidos.get(miid).body.velocity.x = 0;
                    jugadoresImprimidos.get(miid).animations.stop();
                }
            }
        }
        if (cursors.up.isDown) {
            // while(salto && cantidadSalto < 3){
            //     jugadoresImprimidos.get(miid).body.moveUp(1200);
            //     salto = false;
            // }
            while (salto) {
                jugadoresImprimidos.get(miid).body.moveUp(1200);
                salto = false;
            }
            Client.presionar(data);
            // console.log(cantidadSalto);
        } else if (cursors.up.isUp) {
            // if(cantidadSalto > 2 && !salto){
            //     cantidadSalto = 0;
            // }
            // cantidadSalto ++;
            salto = true;
        }
    }
    
}

Game.render = function () {
}

Game.init = function () {
    game.stage.disableVisibilityChange = true;
};

Game.preload = function () {
    console.log("ejecuto preload");
    // mapaAleatorio();
    Client.askNewPlayer();
    game.load.tilemap('map', `assets/mapas/mapa${numeroMapa}/elMapa${numeroMapa}.json`, null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', `assets/mapas/mapa${numeroMapa}/mapa${numeroMapa}.png`, 16, 16);
    game.load.spritesheet('ninja', 'assets/imagenes/personajes/correr.png', 709, 624);
    game.load.physics('ninja_physics', 'assets/imagenes/personajes/correr_physics.json');
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
            jugadoresImprimidos.get(id).animations.stop();
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
Game.recibirNumeroServidor = function (numero) {
    numeroMapa = numero;
    // game.state.start('mapa1');
    nocolision.destroy();
    suelo.destroy();
    doblesuelo.destroy();
    arboles.destroy();
    // map.destroy();
    
    // game.load.tilemap('map', `assets/mapas/mapa${numero}/elMapa${numero}.json`, null, Phaser.Tilemap.TILED_JSON);
    // game.load.spritesheet('tileset', `assets/mapas/mapa${numero}/mapa${numero}.png`, 16, 16);
    
    // console.log(map);
    // g_tilemapLayer = this.game.add.tilemapLayer (0, 0, 800, 800, g_tileset, g_tilemap, 0);
    // map = game.add.tilemap('map');
    // console.log(map);
    // map.addTilesetImage('paisaje', 'tileset');
    // nocolision = map.createLayer('nocolision');
    // suelo = map.createLayer('suelo');
    // doblesuelo = map.createLayer('doblesuelo');
    // arboles = map.createLayer('arboles');
    // map.setCollisionBetween(40, 216, true, suelo);
    // map.setCollisionBetween(40, 216, true, doblesuelo);
}
game.state.add('Game', Game);
game.state.start('Game');


