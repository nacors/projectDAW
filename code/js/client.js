var Client = {};
Client.socket = io.connect();
Client.askNewPlayer = function () {
    this.socket.emit('newplayer');
};

//llamada del metodo del servidor para iniciar sesion
Client.iniciarSesion = function (nick, cont) {
    Client.socket.emit('iniciarSesion', { nick: nick, cont: cont });
}

//llamada al metodo del servidort para registrarse
Client.registrarse = function (nick, cont) {
    Client.socket.emit('registrarse', { nick: nick, cont: cont });
}

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
    Game.addNewPlayer(data.id, data.x, data.y, jugadores);
});
