//VARIABLES------------------------------------------------------------------------------------------------------------------------------------
var suelo, arboles, jugador1, cursors, jumpButton;
var jumpTimer = 0;
var salto = true;
var jugadoresImprimidos = new Map();
var idJugadoresImprimidos = [];
var game = new Phaser.Game(2000, 990, Phaser.AUTO, document.getElementById('game'));
var idContactoPermitido = [5, 6, 19];
var Game = {};
var miid = 0;
var mensaje;
var posx, posy;
Game.playerMap = new Map();


//FUNCIONES GAME---------------------------------------------------------------------------------------------------------------------------------
Game.addNewPlayer = function (id, x, y, jugadores) {
    if (jugadoresImprimidos.size < 1) {
        miid = id;
    }
    // console.log("Imprimimos jugador -----------------------------");
    // console.log("Imprimimos jugador: " + id);
    let g = game.add.sprite(x, y, 'ninja');
    Game.playerMap.set(id, g);
    var jugador = Game.playerMap.get(id);
    jugador.anchor.setTo(0.5, 0.5);
    jugador.scale.setTo(0.2, 0.2);
    jugador.animations.add('right');
    game.physics.p2.enable(jugador, true);
    resizePolygon('ninja_physics', 'ninja_escalado', 'correr', 0.2);
    jugador.body.clearShapes();
    jugador.body.loadPolygon("ninja_escalado", "correr");
    jugador.body.fixedRotation = true;
    jugador.body.mass = 70;
    //hacemos al personaje inmovible
    jugador.body.immovable = true;
    jugador.body.moves = false;
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

};

Game.create = function () {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 5000;
    game.stage.backgroundColor = '#ccffff';
    var map = game.add.tilemap('map');
    map.addTilesetImage('paisaje', 'tileset');
    suelo = map.createLayer('suelo');
    arboles = map.createLayer('arboles');
    map.setCollisionBetween(4566, 5350, true, suelo);
    game.physics.p2.convertTilemap(map, suelo);
    suelo.inputEnable = true;
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    Client.askNewPlayer();
};

Game.update = function () {
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
    if (cursors.up.isDown && salto) {
        Client.presionar("saltar");
        jugadoresImprimidos.get(miid).body.moveUp(700);
    }
}

Game.render = function () {
}

Game.init = function () {
    game.stage.disableVisibilityChange = true;
};

Game.preload = function () {
    game.load.tilemap('map', 'assets/mapas/nevado.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/imagenes/paisaje.png', 10, 10);
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
    var segundos = 4;
    var imprimirSegundos;
    setTimeout(function () {
        mensaje.setText("partida empieza en...");
        imprimirSegundos = setInterval(function () {
            mensaje.setText(segundos);
            segundos--;
            if (segundos == -1) {
                iniciarPartida();
                mensaje.setText("");
                clearInterval(imprimirSegundos);
            }
        }, 1000);
    }, 5000);

}
game.state.add('Game', Game);
game.state.start('Game');


