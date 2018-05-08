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
var posx,posy;
Game.playerMap = new Map();


//FUNCIONES GAME---------------------------------------------------------------------------------------------------------------------------------
Game.addNewPlayer = function (id, x, y, jugadores) {
    if (jugadoresImprimidos.size < 1) {
        miid = id;
    }
    console.log("Imprimimos jugador -----------------------------");
    console.log("Imprimimos jugador: " + id);
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

    console.log("MI MAP de jugadores ES: ****************************");
    console.log(jugadoresImprimidos);

};

Game.create = function () {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 5000;
    game.stage.backgroundColor = '#ffffff';
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
    //movimiento para el personaje que controla el jugador
    if (cursors.left.isDown) {
        Client.presionar("izquierda");
        jugadoresImprimidos.get(miid).body.moveLeft(1000);
        jugadoresImprimidos.get(miid).animations.play('right', 10, true);
        
    }
    else if (cursors.right.isDown) {
        Client.presionar("derecha");
        jugadoresImprimidos.get(miid).body.moveRight(1000);
        jugadoresImprimidos.get(miid).animations.play('right', 10, true);
        
    }
    else{
        Client.soltar("soltar");
        if(jugadoresImprimidos.has(miid)){
            jugadoresImprimidos.get(miid).body.velocity.x = 0;
            jugadoresImprimidos.get(miid).animations.stop();
        }
    }
    if (cursors.up.isDown && salto) {
        Client.presionar("saltar");
        jugadoresImprimidos.get(miid).body.moveUp(1000);
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

Game.movimiento = function (id, movimiento) {
    //movimiento para los otros personajes
    if (movimiento == "derecha") {
        jugadoresImprimidos.get(id).body.moveRight(1000);
        jugadoresImprimidos.get(id).animations.play('right', 10, true);
    } else if (movimiento == "izquierda") {
        jugadoresImprimidos.get(id).body.moveLeft(1000);
        jugadoresImprimidos.get(id).animations.play('right', 10, true);
    } else if (movimiento == "saltar") {
        jugadoresImprimidos.get(id).body.moveUp(1000);
    } else if (movimiento == "soltar") {
        if (jugadoresImprimidos.size != 0) {
            // console.log("Entrasmo en el game para soltar tecla");
            jugadoresImprimidos.get(id).body.velocity.x = 0;
            jugadoresImprimidos.get(id).animations.stop();
        }
    }
}

Game.iniciarPartida = function () {
    var segundos = 5;
    var imprimirSegundos;
    setTimeout(function () {
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


