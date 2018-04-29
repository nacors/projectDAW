window.onload = () => {
    var Client = {};
    Client.socket = io.connect();
    Client.askNewPlayer = function () {
        Client.socket.emit('usuarioJuego');
    };


    var game = new Phaser.Game(2000, 920, Phaser.AUTO, document.getElementById('game'));
    var Game = {};

    Game.init = function () {
        game.stage.disableVisibilityChange = true;
    };

    Game.preload = function () {
        game.load.tilemap('map', 'assets/mapas/nevado.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.spritesheet('tileset', 'assets/imagenes/paisaje.png', 10, 10);
    };

    Game.create = function () {
        game.physics.startSystem(Phaser.Physics.P2JS);

        game.stage.backgroundColor = '#2d2d2d';
        var map = game.add.tilemap('map');
        map.addTilesetImage('paisaje', 'tileset'); // paisaje is the key of the tileset in map's JSON file
        var layer;
        for (var i = 0; i < map.layers.length; i++) {
            layer = map.createLayer(i);
        }
        layer.inputEnabled = true; // Allows clicking on the map
        game.physics.p2.convertTilemap(map, layer);
    };

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
