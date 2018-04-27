window.onload = () => {
    //funciones del lado cliente
    document.getElementById("accionRegistrar").addEventListener("click", function () {
        this.style.display = "none";
        document.getElementById("iniciarSesion").style.display = "none";
        document.getElementById("registrarse").setAttribute("style", "display: grid !important");
        document.getElementById("accionIniciarSesion").setAttribute("style", "display: inline");
    });
    document.getElementsByName("invitado")[0].addEventListener("click", function (e) {
        e.preventDefault();
        alert("jugar como invitado (acabar)");
    });
    document.getElementsByName("iniciar")[0].addEventListener("click", function (e) {
        e.preventDefault();
        console.log();
        Client.iniciarSesion(document.getElementsByName("usernameI")[0].value, document.getElementsByName("passwordI")[0].value);
    });
    document.getElementsByName("registrar")[0].addEventListener("click", function (e) {
        e.preventDefault();
        Client.registrarse(document.getElementsByName("usernameR")[0].value, document.getElementsByName("passwordR")[0].value);
        console.log("usuario registrado con exito");
    });
    document.getElementById("accionIniciarSesion").addEventListener("click", function () {
        this.style.display = "none";
        document.getElementById("iniciarSesion").style.display = "grid";
        document.getElementById("registrarse").setAttribute("style", "display: none !important");
        document.getElementById("accionRegistrar").setAttribute("style", "display: inline");
    });


    //funciones para el servidor que se envian y se reciben
    var Client = {};
    Client.socket = io.connect();
    Client.askNewPlayer = function () {
        Client.socket.emit('newplayer');
    };
    Client.iniciarSesion = function (nick, cont) {
        Client.socket.emit('iniciarSesion', { nick: nick, cont: cont });
    }

    Client.registrarse = function (nick, cont) {
        Client.socket.emit('registrarse', { nick: nick, cont: cont });
    }

    Client.socket.on('malIniciado', function () {
        document.getElementById("textErrorI").innerHTML = "El correo o la contraseña no son correctos. Tal vez no estas registrado";
        document.getElementById("textErrorI").style.transition = "0.5s";
        document.getElementById("textErrorI").style.color = "tomato";
        document.getElementById("invitado").style.marginTop = "120px";
        setTimeout(function () {
            document.getElementById("textErrorI").innerHTML = "";
            document.getElementById("invitado").style.marginTop = "200px";
        }, 5000);
    });

    Client.socket.on('nickExiste', function () {
        document.getElementById("textErrorR").innerHTML = "Este nick ya esta registrado";
        document.getElementById("textErrorR").style.transition = "0.5s";
        document.getElementById("textErrorR").style.color = "tomato";
        document.getElementById("invitado").style.marginTop = "150px";
        document.getElementsByName("usernameR")[0].focus();
        setTimeout(function () {
            document.getElementById("textErrorR").innerHTML = "";
            document.getElementById("invitado").style.marginTop = "200px";
        }, 3000);
    });

    Client.askNewPlayer();
}