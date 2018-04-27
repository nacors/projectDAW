var game = new Phaser.Game(2000, 1000, Phaser.AUTO, document.getElementById('game'));
var Game = {};




Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.tilemap('map', 'assets/mapas/nevado.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/imagenes/paisaje.png',10,10);
};

Game.create = function(){
    game.physics.startSystem(Phaser.Physics.P2JS);

    game.stage.backgroundColor = '#2d2d2d';
    var map = game.add.tilemap('map');
    map.addTilesetImage('paisaje', 'tileset'); // paisaje is the key of the tileset in map's JSON file
    var layer;
    for(var i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);
    }
    layer.inputEnabled = true; // Allows clicking on the map
    game.physics.p2.convertTilemap(map, layer);
};

game.state.add('Game',Game);
game.state.start('Game');