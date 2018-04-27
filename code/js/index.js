window.onload = () => {
    var zonaIniciarSesion = document.getElementById("iniciarSesion");
    var zonaRegistrarse = document.getElementById("registrarse");
    var botonVolver = document.getElementById("accionIniciarSesion");
    var botonIrRegistrar = document.getElementById("accionRegistrar");
    var zonaInvitado = document.getElementById("invitado");
    var botonesInvitado = document.getElementsByName("invitado")[0];
    var botonIniciarSesion = document.getElementsByName("iniciar")[0];
    var botonRegistrarse = document.getElementsByName("registrar")[0];
    var mensajeInicio = document.getElementById("textErrorI");
    var mensajeRegistro = document.getElementById("textErrorR");


    //funciones del lado cliente
    //si queremos ir al apartado de registro
    botonIrRegistrar.addEventListener("click", function () {
        this.style.display = "none";
        zonaIniciarSesion.style.display = "none";
        zonaRegistrarse.setAttribute("style", "display: grid !important");
        botonVolver.setAttribute("style", "display: inline");
        mensajeInicio.innerHTML = "";
        zonaInvitado.style.marginTop = "200px";
    });

    //si queremos jugar como invitado
    botonesInvitado.addEventListener("click", function (e) {
        e.preventDefault();
        alert("jugar como invitado (acabar)");
    });

    //si queremos iniciar sesion
    botonIniciarSesion.addEventListener("click", function (e) {
        e.preventDefault();
        comrpobarCamposInicioSesion();
    });

    //si nos queremos registrar
    botonRegistrarse.addEventListener("click", function (e) {
        e.preventDefault();
        comrpobarCamposRegistro();
    });

    //si queremos volver a la ventan inicial
    botonVolver.addEventListener("click", function () {
        this.style.display = "none";
        zonaIniciarSesion.style.display = "grid";
        zonaRegistrarse.setAttribute("style", "display: none !important");
        botonIrRegistrar.setAttribute("style", "display: inline");
    });



    //******************FUNCIONES PERSONALES******************//
    function comrpobarCamposInicioSesion() {
        var nombre = document.getElementsByName("usernameI")[0].value;
        var contr = document.getElementsByName("passwordI")[0].value;
        if (nombre != "" && contr != "") {
            //llamamos al metodo del cliente que a su vez llamara el metodo del servidor
            Client.iniciarSesion(nombre, contr);
        } else {
            mensajeInicio.innerHTML = "Te faltan campos por rellenar";
            zonaInvitado.style.marginTop = "163px";
            setTimeout(function () {
                mensajeInicio.innerHTML = "";
                zonaInvitado.style.marginTop = "200px";
            }, 3000);
        }
    }

    function comrpobarCamposRegistro(){
        var nombre = document.getElementsByName("usernameR")[0].value;
        var contr = document.getElementsByName("passwordR")[0].value;
        if (nombre != "" && contr != "") {
            //llamamos al metodo del cliente que a su vez llamara el metodo del servidor
            Client.registrarse(nombre, contr);
        } else {
            mensajeRegistro.innerHTML = "Te faltan campos por rellenar";
            zonaInvitado.style.marginTop = "164px";
            setTimeout(function () {
                mensajeRegistro.innerHTML = "";
                zonaInvitado.style.marginTop = "200px";
            }, 3000);
        }
    }

    //******************FUNCIONES DEL SERVIDOR******************//
    var Client = {};
    Client.socket = io.connect();
    Client.askNewPlayer = function () {
        Client.socket.emit('newplayer');
    };

    //llamada del metodo del servidor para iniciar sesion
    Client.iniciarSesion = function (nick, cont) {
        Client.socket.emit('iniciarSesion', { nick: nick, cont: cont });
    }

    //llamada al metodo del servidort para registrarse
    Client.registrarse = function (nick, cont) {
        Client.socket.emit('registrarse', { nick: nick, cont: cont });
    }

    //funcion que utiliza servidor si los datos introducidos son incorrectos 
    Client.socket.on('malIniciado', function () {
        mensajeInicio.innerHTML = "El correo o la contraseña no son correctos. Tal vez no estas registrado";
        mensajeInicio.style.transition = "0.5s";
        mensajeInicio.style.color = "tomato";
        botonesInvitado.style.marginTop = "120px";
        setTimeout(function () {
            mensajeInicio.innerHTML = "";
            botonesInvitado.style.marginTop = "200px";
        }, 5000);
    });

    //funcion que utiliza servidor si existe un nickanem en el intento del registro
    Client.socket.on('nickExiste', function () {
        mensajeRegistro.innerHTML = "Este nick ya esta registrado";
        mensajeRegistro.style.transition = "0.5s";
        mensajeRegistro.style.color = "tomato";
        botonesInvitado.style.marginTop = "150px";
        document.getElementsByName("usernameR")[0].focus();
        setTimeout(function () {
            mensajeRegistro.innerHTML = "";
            botonesInvitado.style.marginTop = "200px";
        }, 3000);
    });

    Client.askNewPlayer();
}