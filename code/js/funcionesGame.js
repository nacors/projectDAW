var frasesRius = ["El windows es una mierda!", "Usa un navegador de verdad!", "Viteh!", "Que eres, de Madrid?"];
var frasesInma = ["Estamos a lo que estamos?", "Venga, vamos a ver el pdf", "Esto esta mal", "Me gusta mucho"];
var frasesSamuel = ["Que tal vais?", "Chicos, hoy toca un tipo test", "Teneis la entrega de 'fora de termini'", "Si a mi me dicen que haces UML, te contrato"];

//imprime jugadores si alguien se ha conectado
function imprimirJugador(jugador) {
    let g = game.add.sprite(jugador.x, jugador.y, 'ninja');
    Game.playerMap.set(jugador.id, g);
    var jugador = Game.playerMap.get(jugador.id);
    jugador.anchor.setTo(0.5, 0.5);
    jugador.scale.setTo(0.2, 0.2);
    jugador.animations.add('right');
    game.physics.p2.enable(jugador, true);
    resizePolygon('ninja_physics', 'ninja_escalado', 'correr', 0.2);
    jugador.body.clearShapes();
    jugador.body.loadPolygon("ninja_escalado", "correr");
    jugador.body.fixedRotation = true;
    jugador.body.mass = 70;

    //metemos el jugador creado en una array
    jugadoresImprimidos.set(jugador.id,g);
    //metemos la id del jugador imprimido
    idJugadoresImprimidos.push(jugador.id);
}


//funcion que redimensiona fisicas de colisiones
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

//si se recarga la pagina a la hora del juego se reinicia todo para no poder continiar jugando
if (window.performance.navigation.type == 1) {
    if (confirm('Quieres salir?')) {
        location.href = "/";
        jugadoresImprimidos = [];
        idJugadoresImprimidos = [];
        Client.killAllConnections();
    }
    else {
        alert('Correcto');
    }
}
