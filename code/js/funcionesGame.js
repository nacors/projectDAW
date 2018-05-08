var frasesRius = ["El windows es una mierda!", "Usa un navegador de verdad!", "Viteh!", "Que eres, de Madrid?"];
var frasesInma = ["Estamos a lo que estamos?", "Venga, vamos a ver el pdf", "Esto esta mal", "Me gusta mucho"];
var frasesSamuel = ["Que tal vais?", "Chicos, hoy toca un tipo test", "Teneis la entrega de 'fora de termini'", "Si a mi me dicen que haces UML, te contrato"];

//imprime jugadores si alguien se ha conectado
function imprimirJugador(jugadorImprimir) {
    let g = game.add.sprite(jugadorImprimir.x, jugadorImprimir.y, 'ninja');
    Game.playerMap.set(jugadorImprimir.id, g);
    var jugador = Game.playerMap.get(jugadorImprimir.id);
    jugador.anchor.setTo(0.5, 0.5);
    jugador.scale.setTo(0.2, 0.2);
    jugador.animations.add('right');
    game.physics.p2.enable(jugador, true);
    resizePolygon('ninja_physics', 'ninja_escalado', 'correr', 0.2);
    jugador.body.clearShapes();
    jugador.body.loadPolygon("ninja_escalado", "correr");
    jugador.body.fixedRotation = true;
    jugador.body.mass = 70;
    jugador.body.immovable = true;
    jugador.body.moves = false;
    jugadoresImprimidos.set(jugadorImprimir.id, g);
    //metemos la id del jugador imprimido
    idJugadoresImprimidos.push(jugadorImprimir.id);
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
    alert("el juego se va a interrumpir, todos los jugadores iran al menu de logeo");
    location.href = "/";
    jugadoresImprimidos = [];
    idJugadoresImprimidos = [];
    Client.killAllConnections();
}

function iniciarPartida() {
    if (idJugadoresImprimidos[0] < idJugadoresImprimidos[1]) {
        jugadoresImprimidos.get(idJugadoresImprimidos[0]).body.x = 200;
        jugadoresImprimidos.get(idJugadoresImprimidos[1]).body.x = 400;
    } else {
        jugadoresImprimidos.get(idJugadoresImprimidos[1]).body.x = 200;
        jugadoresImprimidos.get(idJugadoresImprimidos[0]).body.x = 400;
    }
}

function textoEspera() {
    console.log("imprimimos el texto de espera");
    propiedadesTexto = {
        fill: "white",
        stroke: "black",
        fontSize: 40
    };
    if (jugadoresImprimidos.size != 2) {
        mensaje = game.add.text(game.world.centerX, game.world.centerY, "Esperando a otro jugador...", propiedadesTexto);
        mensaje.anchor.setTo(0.5, 0.5);
        mensaje.setShadow(1, 1, 'black', 5);
    }
    
}