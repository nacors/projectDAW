var Client = {};
Client.socket = io.connect();
Client.askNewPlayer = function () {
    this.socket.emit('newplayer');
};

//elimina todas las conexiones existentes y las reinicia de nuevo
Client.killAllConnections = function () {
    Client.socket.emit("matarConexiones");
};
//llamada del metodo del servidor para iniciar sesion
Client.iniciarSesion = function (nick, cont) {
    Client.socket.emit('iniciarSesion', { nick: nick, cont: cont });
}

//llamada al metodo del servidort para registrarse
Client.registrarse = function (nick, cont) {
    Client.socket.emit('registrarse', { nick: nick, cont: cont });
}

//llama a los metodos para enviar su movimiento
Client.presionar = function (data) {
    Client.socket.emit('presionar', data);
}
Client.soltar = function (data) {
    Client.socket.emit('soltar', data);
}
Client.pedirNumeroAleatorio = function(){
    console.log("pedimos el numero del servidor");
    Client.socket.emit("numMapaServidor");
}

//FUNCIONES QUE SE RECIBEN DEL SERVIDOR***********************************************************
Client.socket.on('malIniciado', function () {
    console.log("iniciamos el metodo del mal logeo");
    mensajeInicio.innerHTML = "El correo o la contraseña no son correctos";
    mensajeInicio.style.transition = "0.5s";
    mensajeInicio.style.color = "tomato";
    zonaInvitado.style.marginTop = "144px";
    setTimeout(function () {
        mensajeInicio.innerHTML = "";
        zonaInvitado.style.marginTop = "200px";
    }, 5000);
});

//funcion que utiliza servidor si existe un nickanem en el intento del registro
Client.socket.on('nickExiste', function () {
    mensajeRegistro.innerHTML = "Este nick ya esta registrado";
    mensajeRegistro.style.transition = "0.5s";
    mensajeRegistro.style.color = "tomato";
    zonaInvitado.style.marginTop = "160px";
    document.getElementsByName("usernameR")[0].focus();
    setTimeout(function () {
        mensajeRegistro.innerHTML = "";
        zonaInvitado.style.marginTop = "200px";
    }, 3000);
});

Client.socket.on('newplayer', function (data, jugadores) {
    console.log("el numero de mapa es " + data.numMap);
    Game.addNewPlayer(data.id, data.x, data.y, jugadores, data.numMap);
});

Client.socket.on('inicarPartida', function () {
    Game.iniciarPartida();
});

//recibe el movimiento del otro personaje
Client.socket.on('presionar', function (id, data) {
    // console.log("ehhhhhh, se ha presionado una tecla");
    Game.movimiento(id, data, "presionar");
});

Client.socket.on('soltar', function (id, data) {
    // console.log("venga vaaaa, que casi lo tenemos");
    Game.movimiento(id, data, "soltar");
});

//redirecciona al menu si algun jugador ser va de la partida
Client.socket.on("finJuego", function(){
    location.href = "/";
});

Client.socket.on("numMapaServidor", function(num){
    Game.recibirNumeroServidor(num);
});

