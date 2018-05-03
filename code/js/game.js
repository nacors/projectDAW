var suelo, arboles, jugador1, cursors, jumpButton;
var jumpTimer = 0;
salto = false;

var game = new Phaser.Game(2000, 990, Phaser.AUTO, document.getElementById('game'));
var idContactoPermitido = [5, 6, 19];

var Game = {};
Game.playerMap = new Map();
Game.init = function () {
    game.stage.disableVisibilityChange = true;
};

Game.preload = function () {
    game.load.tilemap('map', 'assets/mapas/nevado.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/imagenes/paisaje.png', 10, 10);
    game.load.spritesheet('ninja', 'assets/imagenes/personajes/correr.png', 709, 624);
    game.load.physics('ninja_physics', 'assets/imagenes/personajes/correr_physics.json');
};

Game.addNewPlayer = function (id, x, y) {
    console.log('asdasd');
    let g = game.add.sprite(x, y, 'ninja');
    Game.playerMap.set(id, g);
    var jugador2 = Game.playerMap.get(id);
    console.log(jugador2);
    //inserción del jugador y reescalado
    jugador2.anchor.setTo(0.5, 0.5);
    jugador2.scale.setTo(0.2, 0.2);
    
    jugador2.animations.add('right');
    


    //activación de las fisicas del jugador
    game.physics.p2.enable(jugador2, true);
    //le damos la física exacta del personaje al poligono cargado (mano, pierna, cabeza...)
    resizePolygon('ninja_physics', 'ninja_escalado', 'correr', 0.2);
    jugador2.body.clearShapes();
    //damos el poligono exacto redimensionado al ninja
    jugador2.body.loadPolygon("ninja_escalado", "correr");
    jugador2.body.fixedRotation = true;
    jugador2.body.mass = 70;

};

Game.create = function () {


    console.log('create');
    //activación de las fisicas
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 5000;
    //color de fondo
    game.stage.backgroundColor = '#ffffff';
    //creacion del mapa
    var map = game.add.tilemap('map');
    map.addTilesetImage('paisaje', 'tileset'); // paisaje is the key of the tileset in map's JSON file
    //Insertando los distintos lienzos
    suelo = map.createLayer('suelo');
    arboles = map.createLayer('arboles');
    //activar collisiones de suelo
    map.setCollisionBetween(4566, 5350, true, suelo);
    game.physics.p2.convertTilemap(map, suelo);
    //inserción del jugador y reescalado
    /*jugador1 = game.add.sprite(70.9, 847.7, 'ninja');
    jugador1.scale.setTo(.2, 0.2);
    jugador1.anchor.setTo(0.5, 0.5);
    jugador1.animations.add('right');


    //activación de las fisicas del jugador
    game.physics.p2.enable(jugador1, true);
    //le damos la física exacta del personaje al poligono cargado (mano, pierna, cabeza...)
    resizePolygon('ninja_physics', 'ninja_escalado', 'correr', 0.2);
    jugador1.body.clearShapes();
    //damos el poligono exacto redimensionado al ninja
    jugador1.body.loadPolygon("ninja_escalado", "correr");
    jugador1.body.fixedRotation = true;
    jugador1.body.mass = 50;*/

    //captura de los movimientos
    suelo.inputEnable = true;
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    //metodos de inicio de colision y fin de colision
    /*jugador1.body.onBeginContact.add(saltar, this);
    jugador1.body.onEndContact.add(nosaltar, this);
    console.log(jugador1);*/
    /*********************FUNCIONES DEL SOCKET********************/
    Client.askNewPlayer();
};

function resizePolygon(originalPhysicsKey, newPhysicsKey, shapeKey, scale) {
    var newData = [];
    var data = game.cache.getPhysicsData(originalPhysicsKey, shapeKey);

    for (var i = 0; i < data.length; i++) {
        var vertices = [];

        for (var j = 0; j < data[i].shape.length; j += 2) {
            vertices[j] = data[i].shape[j] * scale;
            vertices[j + 1] = data[i].shape[j + 1] * scale;
        }

        newData.push({ shape: vertices });
    }

    var item = {};
    item[shapeKey] = newData;
    game.load.physics(newPhysicsKey, '', item);

}

Game.update = function () {
    /*if (cursors.left.isDown) {
        jugador1.body.moveLeft(1000);
        jugador1.animations.play('right', 10, true);
    }
    else if (cursors.right.isDown) {
        jugador1.body.moveRight(1000);
        jugador1.animations.play('right', 10, true);
    }
    else {
        jugador1.body.velocity.x = 0;
        jugador1.animations.stop();
    }
    if (jumpButton.isDown && salto) {

        jugador1.body.moveUp(1000);
    }*/

}

Game.render = function () {

}

//Funciones para el salto --EN DESARROLLO--
function saltar(body, bodyB, shapeA, shapeB, equation) {
    console.log(bodyB.id);
    //solo salta en las ids que quiero
    //salto = idContactoPermitido.indexOf(bodyB.id) != -1 ? true : false;
    salto = true;
}
function nosaltar(body, bodyB) {
    salto = false;
}

game.state.add('Game', Game);
game.state.start('Game');

/*********************FUNCIONES PARA EL LOGEO*********************/

/*********************FUNCIONES DE EASTER EGG*********************/
var frasesRius = ["El windows es una mierda!", "Usa un navegador de verdad!", "Viteh!", "Que eres, de Madrid?"];
var frasesInma = ["Estamos a lo que estamos?", "Venga, vamos a ver el pdf", "Esto esta mal", "Me gusta mucho"];
var frasesSamuel = ["Estamos a lo que estamos?", "Venga, vamos a ver el pdf", "Esto esta mal", "Me gusta mucho"];


