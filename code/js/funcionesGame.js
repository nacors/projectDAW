var frasesRius = ["El Wirus es una mierda!", "Usa un navegador de verdad!", "Viteh!", "Que eres, de Madrid?"];
var frasesInma = ["Estamos a lo que estamos?", "Venga, vamos a ver el pdf", "Esto esta mal", "Me gusta mucho"];
var frasesSamuel = ["Que tal vais?", "Chicos, hoy toca un tipo test", "Teneis la entrega de 'fora de termini'", "Si a mi me dices que haces UML, te contrato"];

//imprime jugadores si alguien se ha conectado
function imprimirJugador(jugadorImprimir) {
    let g = game.add.sprite(jugadorImprimir.x, jugadorImprimir.y, 'caballero');
    Game.playerMap.set(jugadorImprimir.id, g);
    var jugador = Game.playerMap.get(jugadorImprimir.id);
    jugador.anchor.setTo(0.5, 0.5);
    jugador.scale.setTo(1.3, 1.3);
    jugador.animations.add('right', [15, 16, 17, 18, 19], 60, true);
    jugador.animations.add('stay', [1, 2, 3, 4], 60, true);
    jugador.animations.add('hit1', [5, 6, 7, 8, 9, 10], 60, false);
    jugador.animations.add('hit2', [11, 12, 13, 14], 60, true);
    jugador.animations.play('stay', 10, true);
    game.physics.p2.enable(jugador);
    //resizePolygon('ninja_physics', 'ninja_escalado', 'correr', 0.1);
    jugador.body.setRectangle(35, 58, -10, 22);
    jugador.body.fixedRotation = true;
    jugador.body.mass = 70;
    jugador.body.immovable = true;
    jugador.body.moves = false;
    jugador.name = "enemigo";
    jugadoresImprimidos.set(jugadorImprimir.id, g);
    //metemos la id del jugador imprimido
    idJugadoresImprimidos.push(jugadorImprimir.id);
    //metemos el nombre del jugador
    //si creamos copia imprimimos el nombre de miid
    //añadirNombreUsuario();
    //enviarMiNombreUsuario();
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

function saltar(body, bodyB, shapeA, shapeB, equation) {
    //solo salta en las ids que quiero
    salto = idContactoPermitido.indexOf(bodyB.id) != -1 ? true : false;
    // salto = true;
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
        jugadoresImprimidos.get(idJugadoresImprimidos[0]).body.x = 3450;
        jugadoresImprimidos.get(idJugadoresImprimidos[1]).body.x = 2950;
        miDireccion = "derecha";
    } else {
        jugadoresImprimidos.get(idJugadoresImprimidos[1]).body.x = 3450;
        jugadoresImprimidos.get(idJugadoresImprimidos[0]).body.x = 2950;
        miDireccion = "izquierda";
    }
}

function textoEspera() {
    // console.log("imprimimos el texto de espera");
    if (jugadoresImprimidos.size != 2) {
        mensaje = game.add.text(game.world.centerX, game.world.centerY, "Esperando a otro jugador...", propiedadesTexto);
        mensaje.anchor.setTo(0.5, 0.5);
        mensaje.setShadow(1, 1, 'black', 5);
    }
}

function checkOverlap(body1, body2) {
    if (body1 != null && body2 != null) {
        if ((body1.sprite && body2.sprite) && (nombreSprite(body1) && nombreSprite(body2))) {
            //console.log("Ambos muertos");
        } else if (nombreSprite(body1) && (body1.sprite && body2.sprite)) {
            if (body2.x < body1.x && direccion == "left") {
                if (jugadoresImprimidos.get(miid) == body1.sprite) {
                    // console.log("matamos al enemigo que se encuentra a la izquierda");
                    if (body2.sprite.alpha != 0) {
                        direccionCamara = miDireccion;
                        setCamara(body1.sprite);
                        if (miDireccion != undefined) {
                            // console.log("Enviamos la direccion: " + miDireccion);
                            Client.opacityEnemigo("ocultar", miDireccion);
                        }
                    }
                    body2.sprite.alpha = 0;
                    //ocultar al enemigo
                    // console.log("YO mato a enemigo mirando hacia: " + direccion);
                    // console.log("mostramos enemigo que hemos matado a la izquierda");
                    // volverTransparenciaNormal();
                    sePuedeReaparecer = true;
                }
            } else if (body2.x > body1.x && direccion == "right") {
                // console.log("Muere " + body2.sprite.name);
                if (jugadoresImprimidos.get(miid) == body1.sprite) {
                    // console.log("matamos al enemigo que se encuentra a la derecha");
                    if (body2.sprite.alpha != 0) {
                        direccionCamara = miDireccion;
                        setCamara(body1.sprite);
                        if (miDireccion != undefined) {
                            // console.log("Enviamos la direccion: " + miDireccion);
                            Client.opacityEnemigo("ocultar", miDireccion);
                        }
                    }
                    body2.sprite.alpha = 0;
                    // console.log("mostramos enemigo que hemos matado a la derecha");
                    // volverTransparenciaNormal();
                    sePuedeReaparecer = true;
                }
            }
        } else if (nombreSprite(body2) && (body1.sprite && body2.sprite)) {
            if (body2.x > body1.x && direccion == "left") {
                // console.log("Muere " + body1.sprite.name);
                if (jugadoresImprimidos.get(miid) == body2.sprite) {
                    // console.log("matamos al enemigo que se encuentra a la izquierda");
                    if (body1.sprite.alpha != 0) {
                        direccionCamara = miDireccion;
                        setCamara(body2.sprite);
                        if (miDireccion != undefined) {
                            // console.log("Enviamos la direccion: " + miDireccion);
                            Client.opacityEnemigo("ocultar", miDireccion);
                        }
                    }
                    body1.sprite.alpha = 0;
                    // console.log("mostramos enemigo que hemos matado a la izquierda");
                    // volverTransparenciaNormal();
                    sePuedeReaparecer = true;
                }
            } else if (body2.x < body1.x && direccion == "right") {
                // console.log("Muere " + body1.sprite.name);
                if (jugadoresImprimidos.get(miid) == body2.sprite) {
                    // console.log("matamos al enemigo que se encuentra a la derecha");
                    if (body1.sprite.alpha != 0) {
                        direccionCamara = miDireccion;
                        setCamara(body2.sprite);
                        if (miDireccion != undefined) {
                            // console.log("Enviamos la direccion: " + miDireccion);
                            Client.opacityEnemigo("ocultar", miDireccion);
                        }
                    }
                    body1.sprite.alpha = 0;
                    // console.log("mostramos enemigo que hemos matado a la derecha");
                    // volverTransparenciaNormal();
                    sePuedeReaparecer = true;
                }
            }
        }
        if (body1.sprite && body2.sprite) {
            if (nombreSprite(body1) == "murcielago") {
                // console.log("has chocado con un murcielago");
                if (jugadoresImprimidos.get(miid) == body2.sprite) {
                    body2.sprite.alpha = 0;
                    //no le permitimos el movimiento al jugador con esa variable
                    sePuedeJugar = false;
                    Client.opacityEnemigo("fueraMapa", direccionCamara);
                    isFueraMapa = true;
                }
            } else if (nombreSprite(body2) == "murcielago") {
                // console.log("has chocado con un murcielago");
                if (jugadoresImprimidos.get(miid) == body1.sprite) {
                    body1.sprite.alpha = 0;
                    //no le permitimos el movimiento al jugador con esa variable
                    sePuedeJugar = false;
                    Client.opacityEnemigo("fueraMapa", direccionCamara);
                    isFueraMapa = true;
                }
            }
            if (nombreSprite(body1) == "pocion" && body2.sprite.key == "caballero") {
                // console.log("contacto con pocion");
                masVelocidad(body2.sprite, 3);
                body1.sprite.destroy();
                audioPocion.play();
            } else if (nombreSprite(body2) == "pocion" && body1.sprite.key == "caballero") {
                // console.log("contacto con pocion");
                masVelocidad(body2.sprite, 3);
                body2.sprite.destroy();
                audioPocion.play();
            }
        }
        if ((body1.sprite && body2.sprite)) return false;
    }
    return true;
}

function nombreSprite(body) {
    //console.log(body.sprite);
    if (body.sprite) {
        if (body.sprite.key == "caballero" && (body.sprite.animations.currentAnim.name == "hit1" || body.sprite.animations.currentAnim.name == "hit2")) return true;
        else if (body.sprite.key == "murcielago") return "murcielago";
        else if (body.sprite.key == "pocion") return "pocion";
    }
    return false;
}

function pegar1(id, direccion) {
    //quitar los magic numbers
    //jugadoresImprimidos.get(id).body.velocity.x = 0;
    if (direccion == "right") jugadoresImprimidos.get(id).body.setRectangle(60, 58, 5, 22);
    else jugadoresImprimidos.get(id).body.setRectangle(60, 58, -5, 22);
    //if (id == miid) quieto = false;
    jugadoresImprimidos.get(id).animations.stop();
    jugadoresImprimidos.get(id).animations.play('hit1', 10, false);
    jugadoresImprimidos.get(id).animations.currentAnim.onComplete.add(function () {
        if (id == miid) quieto = true;
        if (direccion == "right") jugadoresImprimidos.get(id).body.setRectangle(35, 58, -10, 22);
        else jugadoresImprimidos.get(id).body.setRectangle(35, 58, 10, 22);
        jugadoresImprimidos.get(miid).animations.play('stay', 10, true);
    }, this);
}

function pegar2(id, direccion) {
    //jugadoresImprimidos.get(id).body.velocity.x = 0;
    //Client.pegar(data,"hit1");
    if (direccion == "right") jugadoresImprimidos.get(id).body.setRectangle(70, 58, 10, 22);
    else jugadoresImprimidos.get(id).body.setRectangle(70, 58, -10, 22);
    //if (id == miid) quieto = false;
    jugadoresImprimidos.get(id).animations.stop();
    jugadoresImprimidos.get(id).animations.play('hit2', 10, false);
    jugadoresImprimidos.get(id).animations.currentAnim.onComplete.add(function () {
        if (id == miid) quieto = true;
        if (direccion == "right") jugadoresImprimidos.get(id).body.setRectangle(35, 58, -10, 22);
        else jugadoresImprimidos.get(id).body.setRectangle(35, 58, 10, 22);
        jugadoresImprimidos.get(miid).animations.play('stay', 10, true);
    }, this);
}

function moverJugador(id, direccion) {
    if (direccion == "izquierda") {
        jugadoresImprimidos.get(id).scale.setTo(-1.3, 1.3);
        jugadoresImprimidos.get(id).body.setRectangle(35, 58, 10, 22);
        jugadoresImprimidos.get(id).body.moveLeft(700 + sumarVelocidad);
        if(jugadoresImprimidos.get(id).animations.currentAnim.name != "hit1" && jugadoresImprimidos.get(id).animations.currentAnim.name != "hit2")jugadoresImprimidos.get(id).animations.play('right', 10, true);
    } else if (direccion == "derecha") {
        jugadoresImprimidos.get(id).body.setRectangle(35, 58, -10, 22);
        jugadoresImprimidos.get(id).scale.setTo(1.3, 1.3);
        jugadoresImprimidos.get(id).body.moveRight(700 + sumarVelocidad);
        if(jugadoresImprimidos.get(id).animations.currentAnim.name != "hit1" && jugadoresImprimidos.get(id).animations.currentAnim.name != "hit2")jugadoresImprimidos.get(id).animations.play('right', 10, true);
    }
}

function imprimirMensajeOculto(quien) {
    if (quien == "rius") {
        frase = frasesRius[parseInt(Math.random() * (frasesRius.length - 0) + 0)];
    } else if (quien == "samuel") {
        frase = frasesSamuel[parseInt(Math.random() * (frasesSamuel.length - 0) + 0)];
    } else if (quien == "inma") {
        frase = frasesInma[parseInt(Math.random() * (frasesInma.length - 0) + 0)];
    }
    mensajeOculto = game.add.text(jugadoresImprimidos.get(miid).x, jugadoresImprimidos.get(miid).y - 20, frase, {
        fill: "black",
        stroke: "black",
        fontSize: 10
    });
    mensajeOculto.anchor.setTo(0.5, 0.5);
}

function cuentaAtras(segundos) {
    setTimeout(function () {
        mostrarMensajeOculto = false;
        mensajeOculto.destroy();
        contadorTecla = 0;
    }, segundos * 1000);
}

function cargarMapa(numMapa, pociones) {
    //dibujamos el mapa para el jugador
    map = game.add.tilemap(`mapa${numMapa}`);
    //por problemas con capas, en el mapa 1 el orden de carga es diferente
    if (numMapa == 1) {
        fondo = game.add.tileSprite(0, 0, 7000, 900, 'background');
        map.addTilesetImage('paisaje', `tileset${numMapa}`);
        arboles = map.createLayer('arboles');
        doblesuelo = map.createLayer('doblesuelo');
        nocolision = map.createLayer('nocolision');
        suelo = map.createLayer('suelo');
        //otros mapas no presentan este problema
    } else {
        fondo = game.add.tileSprite(0, 0, 7000, 900, 'background');
        map.addTilesetImage('paisaje', `tileset${numMapa}`);
        arboles = map.createLayer('arboles');
        suelo = map.createLayer('suelo');
        nocolision = map.createLayer('nocolision');
        doblesuelo = map.createLayer('doblesuelo');
    }
    map.setCollisionBetween(0, 1000, true, suelo);
    map.setCollisionBetween(40, 216, true, doblesuelo);
    game.physics.p2.convertTilemap(map, suelo);
    game.physics.p2.convertTilemap(map, doblesuelo);

    //ponemos pociones aleatoriamente en el mapa
    imprimirPociones(pociones);
}

function volverTransparenciaNormal() {
    // console.log("mostramos al enemigo");
    // console.log(idJugadoresImprimidos[1]);
    // setTimeout(function () {
    if (sePuedeReaparecer && game.camera.target == null) {
        jugadoresImprimidos.get(idJugadoresImprimidos[1]).alpha = 1;
        Client.opacityEnemigo("mostrar", direccionCamara);
        sePuedeReaparecer = false;
    }

    // }, 3000);
}

function opacityJugador(accion, move) {
    if (accion == "ocultar") {
        //cogemos nuestra id ya que se hace un broadcast del server
        jugadoresImprimidos.get(miid).alpha = 0;
        sePuedeJugar = false;
        direccionCamara = move;
        setCamara(jugadoresImprimidos.get(idJugadoresImprimidos[1]));
    } else if (accion == "mostrar") {
        // console.log("mi id es: " + miid);
        // console.log("me vuelvo a mostrar ya que me han matado");
        jugadoresImprimidos.get(miid).body.x = zonasReaparecion[limiteActual];
        jugadoresImprimidos.get(miid).body.y = 100;
        sePuedeJugar = true;
        jugadoresImprimidos.get(miid).alpha = 1;
    } else if (accion == "fueraMapa") {
        //hacemos desaparecer al enemigo que se ha caido en su pantalla
        jugadoresImprimidos.get(idJugadoresImprimidos[1]).alpha = 0;
        if (jugadoresImprimidos.get(miid).x - jugadoresImprimidos.get(idJugadoresImprimidos[1]).x < 1000
            && jugadoresImprimidos.get(miid).x - jugadoresImprimidos.get(idJugadoresImprimidos[1]).x > -1000) {
            audioCaida.play();
        }
    } else if (accion == "reaparecer") {
        jugadoresImprimidos.get(idJugadoresImprimidos[1]).alpha = 1;
    }
}

function movimientoFondo() {
    //metodo que mueve el fondo del mapa para dar mas efecto de movimiento
    fondo.x = game.camera.x * -0.1;
    fondo.y = game.camera.y * -0.1;
}

function easterEgg() {
    //metodo de huevo de pascua
    if (game.input.keyboard.addKey(Phaser.Keyboard.R).isDown) {
        contadorTecla += 1;
        if (contadorTecla == 200) {
            imprimirMensajeOculto("rius");
            cuentaAtras(5);
            mostrarMensajeOculto = true;
        }
    } else if (game.input.keyboard.addKey(Phaser.Keyboard.I).isDown) {
        contadorTecla += 1;
        if (contadorTecla == 200) {
            imprimirMensajeOculto("inma");
            cuentaAtras(5);
            mostrarMensajeOculto = true;
        }
    } else if (game.input.keyboard.addKey(Phaser.Keyboard.S).isDown) {
        contadorTecla += 1;
        if (contadorTecla == 200) {
            imprimirMensajeOculto("samuel");
            cuentaAtras(5);
            mostrarMensajeOculto = true;
        }
    }
    //easter egg
    if (mostrarMensajeOculto === true) {
        mensajeOculto.position.x = jugadoresImprimidos.get(miid).x;
        mensajeOculto.position.y = jugadoresImprimidos.get(miid).y - 20;
    }
}

function revisarCaidoFueraMapa() {
    //ejecutar esta funcion cada vez que el personaje se mueve
    if (jugadoresImprimidos.get(miid).y > bordeMapa && !isFueraMapa) {
        audioCaida.play();
        jugadoresImprimidos.get(miid).alpha = 0;
        //no le permitimos el movimiento al jugador con esa variable
        sePuedeJugar = false;
        Client.opacityEnemigo("fueraMapa", direccionCamara);
        isFueraMapa = true;
    }
}

//reaparecemos al jugador que se habia caido fuera del mapa
function reaparecerJugador() {
    if (isFueraMapa) {
        cont++;
        if (cont == 200) {
            jugadoresImprimidos.get(miid).body.x = zonasReaparecion[limiteActual];
            jugadoresImprimidos.get(miid).body.y = 100;

            sePuedeJugar = true;
            isFueraMapa = false;
            jugadoresImprimidos.get(miid).alpha = 1;
            Client.opacityEnemigo("reaparecer", direccionCamara);
            cont = 0;
        }
    }
}

function imprimirPociones(data) {
    for (let objeto of data) {
        var pocion = game.add.tileSprite(objeto.x, objeto.y, 500, 500, 'pocion');
        pocion.anchor.setTo(0.5, 0.5);
        pocion.scale.setTo(0.2);
        game.physics.p2.enable(pocion);
        pocion.body.fixedRotation = true;
        pocion.body.setRectangle(40, 35, 0, 0);
        pociones.push(pocion);
    }
}

function numeroRandom(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

function revisarPocionFueraMapa() {
    let fuera;
    if (!isNingunaPocionaFuera) {
        for (let pocion in pociones) {
            if (pociones[pocion].y > bordeMapa) {
                //console.log("eliminada una pocion");
                fuera++;
                pociones[pocion].destroy();
                pociones.splice(pocion, 1);
            }
        }
        if (fuera == 0) {
            isNingunaPocionaFuera = true;
        }
    }
}

function murcielagosVolumen() {
    if (murcielagos.length != 0) {
        var murcielagoX = murcielagos[0].body.x;
        var murcielagoY = murcielagos[0].body.y;
        var personajeX = jugadoresImprimidos.get(miid).body.x;
        var personajeY = jugadoresImprimidos.get(miid).body.y;
        var posX = (murcielagoX - personajeX < 0) ? (murcielagoX - personajeX) * -1 : murcielagoX - personajeX;
        var posY = (murcielagoY - personajeY < 0) ? (murcielagoY - personajeY) * -1 : murcielagoY - personajeY;
        var distancia = Math.sqrt(Math.pow(posX, 2) + Math.pow(posY, 2));
        var volumen = 1 - (distancia / 3000);
        volumen = (volumen < 0) ? 0 : volumen;
        audioMurcielagos.play();
        audioMurcielagos.volume = volumen;
        if (direccionMurcielagos == "derecha") {
            if (murcielagos[0].body.x == 7000) {
                for (SpriteMurc of murcielagos) {
                    SpriteMurc.destroy();
                }
                audioMurcielagos.stop();
                murcielagos = [];
            }
        }
        if (direccionMurcielagos == "izquierda") {
            if (murcielagos[0].body.x == -500) {
                for (SpriteMurc of murcielagos) {
                    SpriteMurc.destroy();
                }
                audioMurcielagos.stop();
                murcielagos = [];
            }
        }
    }
}

function masVelocidad(jugador, segundos) {
    var tiempo = 0;
    sumarVelocidad = 200;
    var intervalo = setInterval(function () {
        tiempo++;
        if (tiempo == segundos) {
            clearInterval(intervalo);
            sumarVelocidad = 0;
        }
    }, 1000);
}

function sonidoSaltar() {
    sonidosSalto[1].play();
}

function añadirNombreUsuario() {
    var nombre = sessionStorage.getItem("usuario");
    if (sessionStorage.getItem("usuario") == null) {
        nombre = "Invitado";
    }
    nombreJugador = game.add.text(jugadoresImprimidos.get(miid).x, jugadoresImprimidos.get(miid).y - 20, nombre, {
        fill: "white",
        stroke: "black",
        fontSize: 15
    });
}

function movimientoNombreJugador(jugador = "yo") {
    let jugadorNombre;
    let id;
    if (jugador != "enemigo") {
        jugadorNombre = nombreJugador;
        id = miid;
    } else {
        jugadorNombre = nombreEnemigo;
        id = idJugadoresImprimidos[1];
    }
    if (jugadorNombre != null) {
        if (direccion == "right") {
            jugadorNombre.position.x = jugadoresImprimidos.get(id).x - 35;
        } else {
            jugadorNombre.position.x = jugadoresImprimidos.get(id).x - 20;
        }
        jugadorNombre.position.y = jugadoresImprimidos.get(id).y - 30;
    }
}

function enviarMiNombreUsuario() {
    //console.log("envio mi nombre a otro usuario");
    Client.nickEnemigo(sessionStorage.getItem("usuario"));
}

function limites(limite) {
    if (jugadoresImprimidos.get(miid).x < limitesMapa[limiteActual] && direccion == "left") jugadoresImprimidos.get(miid).body.velocity.x = 0;
    if (jugadoresImprimidos.get(miid).x > limiteDerecha && direccion == "right") jugadoresImprimidos.get(miid).body.velocity.x = 0;
    //console.log(limiteDerecha + "Este es el limite derecha");
}

function setCamara(body) {
    // console.log("------------------------------------------");
    // console.log("esto es direccionCamara: " + direccionCamara);
    // console.log("esto es el limiteActual: " + limiteActual);
    if (direccionCamara == "derecha") {
        limiteActual++;
        limiteDerecha = limitesMapa[limiteActual] + 1910;
        game.camera.follow(body);
        if (body == jugadoresImprimidos.get(miid)) imrpimirFlechaDireccion("derecha");
        //console.log("sumo limite actual por que voy a la derecha");
    } else if (direccionCamara == "izquierda") {
        limiteActual--;
        limiteDerecha = limitesMapa[limiteActual] + 1910;
        game.camera.follow(body);
        if (body == jugadoresImprimidos.get(miid)) imrpimirFlechaDireccion("izquierda");
    }
    //console.log(game.camera.x + " posicion camara");
}

function fixCamara() {
    // console.log("los limites actuales son: " + limitesMapa[limiteActual] + " - " + limiteDerecha);
    if (direccionCamara == "izquierda") {
        if (game.camera.x <= limitesMapa[limiteActual]) {
            // console.log("quitamos la camara izquierda: " + game.camera.x + " limite actual " + limitesMapa[limiteActual]);
            // reaparecerJugador = true;
            game.camera.target = null;
            Client.pararCamara(game.camera.x);
            if (flecha != null) {
                flecha.destroy();
                felcha = null;
            }
            moverFlecha = false;
        }
    }
    if (direccionCamara == "derecha") {
        if (game.camera.x >= limitesMapa[limiteActual]) {
            // console.log("quitamos la camara derecha: " + game.camera.x + " limite actual " + limitesMapa[limiteActual]);
            game.camera.target = null;
            // reaparecerJugador = true;
            Client.pararCamara(game.camera.x);
            if (flecha != null) {
                flecha.destroy();
                felcha = null;
            }
            moverFlecha = false;
        }
    }
}

function enviarClasificacionJugador(resultado, bajas, tiempo, nick, muertes) {
    Client.clasificacionJugador(resultado, bajas, tiempo, nick, muertes);
}

function ganar() {
    if (miDireccion == "derecha" && jugadoresImprimidos.get(miid).x > 6200) {
        Client.derrota();
        game.input.enabled = false;
        var victory = game.add.sprite(5445, 405, 'fin');
        victory.anchor.setTo(0.5, 0.5);
        victory.animations.add('victory', [0], 60, false);
        victory.animations.play('victory', 60, false);
        game.add.tween(victory.scale).to({ x: 1.5, y: 1.5 }, 2200, Phaser.Easing.Back.InOut, true, 2000, 20, true).loop(true);
        if (sessionStorage.getItem("usuario") != "Invitado") enviarClasificacionJugador("victoria", 0, 0, sessionStorage.getItem("usuario"), 0);
        Client.derrota(5445, 405);
        sePuedeJugar = false;
    }
    else if (miDireccion == "izquierda" && jugadoresImprimidos.get(miid).x < 100) {
        game.input.enabled = false;
        var victory = game.add.sprite(955, 405, 'fin');
        victory.anchor.setTo(0.5, 0.5);
        victory.animations.add('victory', [0], 60, false);
        victory.animations.play('victory', 60, false);
        game.add.tween(victory.scale).to({ x: 1.5, y: 1.5 }, 2200, Phaser.Easing.Back.InOut, true, 2000, 20, true).loop(true);
        if (sessionStorage.getItem("usuario") != "Invitado") enviarClasificacionJugador("victoria", 0, 0, sessionStorage.getItem("usuario"), 0);
        Client.derrota(955, 405);
        sePuedeJugar = false;
    }
}

function derrota(x, y) {
    game.input.enabled = false;
    var victory = game.add.sprite(x, y, 'fin');
    victory.anchor.setTo(0.5, 0.5);
    victory.animations.add('victory', [1], 60, false);
    victory.animations.play('victory', 60, false);
    game.add.tween(victory.scale).to({ x: 1.5, y: 1.5 }, 2200, Phaser.Easing.Back.InOut, true, 2000, 20, true).loop(true);
    if (sessionStorage.getItem("usuario") != "Invitado") enviarClasificacionJugador("derrota", 0, 0, sessionStorage.getItem("usuario"), 0);
    sePuedeJugar = false;
}

function imrpimirFlechaDireccion(direccion) {
    if (direccion == "derecha") {
        flecha = game.add.tileSprite(game.camera.x + 1800, 100, 192, 192, 'flecha');
        flecha.angle += 270;
        flecha.anchor.setTo(0.5);
        flecha.scale.setTo(0.5);
    } else if (direccion == "izquierda") {
        flecha = game.add.tileSprite(game.camera.x + 100, 100, 192, 192, 'flecha');
        flecha.angle += 90;
        flecha.anchor.setTo(0.5);
        flecha.scale.setTo(0.5);
    }
    moverFlecha = true;
    direccionFlecha = direccion;
}

function posicionFlecha() {
    if (moverFlecha) {
        if (direccionFlecha == "derecha") {
            flecha.position.x = game.camera.x + 1800;
        } else if (direccionFlecha == "izquierda") {
            flecha.position.x = game.camera.x + 100;
        }
    }
}