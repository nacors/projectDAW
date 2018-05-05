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

//movimiento de los personajes
document.addEventListener("keydown", function (e) {

    if (e.keyCode == 39) {
        //derecha
        Client.presionar("derecha");
    } else if (e.keyCode == 37) {
        //izquierda
        Client.presionar("izquierda");
    } else if (e.keyCode == 38) {
        console.log("saltar");
        //saltar
        Client.presionar("saltar");
    } else if (e.keyCode == 32) {
        //pegar
        Client.presionar("pegar");
    }
});

document.addEventListener("keyup", function (e) {
    if (e.keyCode == 39 || e.keyCode == 37 || e.keycode == 38 || e.keyCode == 32) {
        Client.soltar("soltar");
    }
});
