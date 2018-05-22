var mapa1 = {
    preload: function () {
        game.load.tilemap('map', `assets/mapas/mapa1/elMapa1.json`, null, Phaser.Tilemap.TILED_JSON);
        game.load.spritesheet('tileset', `assets/mapas/mapa1/mapa1.png`, 16, 16);
        game.load.spritesheet('ninja', 'assets/imagenes/personajes/correr.png', 709, 624);
        game.load.physics('ninja_physics', 'assets/imagenes/personajes/correr_physics.json');

    },
    create: function () {
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

        game.physics.p2.setPostBroadphaseCallback(checkOverlap, this);

    }
}