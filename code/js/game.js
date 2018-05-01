window.onload = () => {
    var Client = {};
    Client.socket = io.connect();
    Client.askNewPlayer = function () {
        Client.socket.emit('usuarioJuego');
    };
    var suelo, arboles, jugador1, cursors, jumpButton;
    var jumpTimer = 0;
    salto = false;

    var game = new Phaser.Game(2000, 990, Phaser.AUTO, document.getElementById('game'));
    var idContactoPermitido = [5, 6, 19];

    var Game = {};

    Game.init = function () {
        game.stage.disableVisibilityChange = true;
    };

    Game.preload = function () {
        game.load.tilemap('map', 'assets/mapas/nevado.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.spritesheet('tileset', 'assets/imagenes/paisaje.png', 10, 10);
        game.load.spritesheet('ninja', 'assets/imagenes/personajes/correr.png', 709, 624);
        game.load.physics('ninja_physics', 'assets/imagenes/personajes/correr_physics.json');
    };

    Game.create = function () {
        //activación de las fisicas
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = 800;
        //color de fondo
        game.stage.backgroundColor = '#2d2d2d';
        //creacion del mapa
        var map = game.add.tilemap('map');
        map.addTilesetImage('paisaje', 'tileset'); // paisaje is the key of the tileset in map's JSON file
        //Insertando los distintos lienzos
        suelo = map.createLayer('suelo');
        arboles = map.createLayer('arboles');
        //activar collisiones de suelo
        map.setCollisionBetween(4566,5350, true, suelo);
        game.physics.p2.convertTilemap(map, suelo);
        //inserción del jugador y reescalado
        jugador1 = game.add.sprite(70.9,847.7,'ninja');
        jugador1.scale.setTo(0.2,0.2);
        jugador1.anchor.setTo(0.5,0.5);
        jugador1.animations.add('right');
        //activación de las fisicas del jugador
        game.physics.p2.enable(jugador1);
        resizePolygon('ninja_physics', 'ninja_escalado', 'correr', 0.2);
        jugador1.body.clearShapes();
        jugador1.body.loadPolygon("ninja_escalado", "correr");
        jugador1.body.fixedRotation = true;      
        //captura de los movimientos
        suelo.inputEnable = true;
        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        //metodos de inicio de colision y fin de colision
        jugador1.body.onBeginContact.add(saltar, this);
        jugador1.body.onEndContact.add(nosaltar, this);
    };

    function resizePolygon(originalPhysicsKey, newPhysicsKey, shapeKey, scale){
        var newData = [];
        var data = game.cache.getPhysicsData(originalPhysicsKey, shapeKey);
     
        for (var i = 0; i < data.length; i++) {
            var vertices = [];
     
            for (var j = 0; j < data[i].shape.length; j += 2) {
               vertices[j] = data[i].shape[j] * scale;
               vertices[j+1] = data[i].shape[j+1] * scale; 
            }
     
            newData.push({shape : vertices});
        }
     
        var item = {};
        item[shapeKey] = newData;
        game.load.physics(newPhysicsKey, '', item);
     
     }

    Game.update = function (){
        if (cursors.left.isDown)
        {
            jugador1.body.moveLeft(400);
            jugador1.animations.play('right', 10, true);
        }
        else if (cursors.right.isDown)
        {
            jugador1.body.moveRight(400);
            jugador1.animations.play('right', 10, true);
        }
        else
        {
            jugador1.body.velocity.x = 0;
            jugador1.animations.stop();
        }
        if (jumpButton.isDown && salto)
        {
            
            jugador1.body.moveUp(500);
            jumpTimer = game.time.now + 1250;
        }

    }

    Game.render = function(){
        
    }

    //Funciones para el salto --EN DESARROLLO--
    function saltar(body, bodyB, shapeA, shapeB, equation){
        //solo salta en las ids que quiero
        salto = idContactoPermitido.indexOf(bodyB.id) != -1 ? true : false;
    }
    function nosaltar(body, bodyB){
        salto = false;
    }

    game.state.add('Game', Game);
    game.state.start('Game');
    /*********************FUNCIONES DEL SOCKET********************/
    Client.askNewPlayer();

    /*********************FUNCIONES PARA EL LOGEO*********************/

    /*********************FUNCIONES DE EASTER EGG*********************/
    var frasesRius = ["El windows es una mierda!", "Usa un navegador de verdad!", "Viteh!", "Que eres, de Madrid?"];
    var frasesInma = ["Estamos a lo que estamos?", "Venga, vamos a ver el pdf", "Esto esta mal", "Me gusta mucho"];
    var frasesSamuel = ["Estamos a lo que estamos?", "Venga, vamos a ver el pdf", "Esto esta mal", "Me gusta mucho"];

}
