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

    //si queremos ir al apartado de registro
    botonIrRegistrar.addEventListener("click", function () {
        this.style.display = "none";
        zonaIniciarSesion.style.display = "none";
        zonaRegistrarse.setAttribute("style", "display: grid !important");
        botonVolver.setAttribute("style", "display: inline");
        mensajeInicio.innerHTML = "";
        zonaInvitado.style.marginTop = "200px";
    });

    //si queremos iniciar sesion
    botonIniciarSesion.addEventListener("click", function (e) {
        var nombre = document.getElementsByName("usernameI")[0].value;
        var contr = document.getElementsByName("passwordI")[0].value;
        e.preventDefault();
        $.ajax({
            type: 'GET',
            url: '/iniciar',
            data: { nick: nombre, contr: contr },
            success: function (taken) {
                if (taken.ok === false) {
                    console.log("false");
                    malIniciado();
                } else {

                    window.location = "/juego";
                }
            }, error: function (xhr, status) {
                console.log(status);
                console.log(xhr);
                alert('!!!!!!ajax!!!!!!!');
            },
        });
    });

    //si nos queremos registrar
    botonRegistrarse.addEventListener("click", function (e) {
        var nombre = document.getElementsByName("usernameR")[0].value;
        var contr = document.getElementsByName("passwordR")[0].value;
        e.preventDefault();
        $.ajax({
            type: 'GET',
            url: '/registrar',
            data: { nick: nombre, contr: contr },
            success: function (taken) {
                if (taken.ok === false) {
                    console.log("false");
                    nickExiste();
                } else {

                    window.location = "/juego";
                }
            }, error: function (xhr, status) {
                console.log(status);
                console.log(xhr);
                alert('!!!!!!ajax!!!!!!!');
            },
        });
    });

    //si queremos volver a la ventan inicial
    botonVolver.addEventListener("click", function () {
        this.style.display = "none";
        zonaIniciarSesion.style.display = "grid";
        zonaRegistrarse.setAttribute("style", "display: none !important");
        botonIrRegistrar.setAttribute("style", "display: inline");
    });

    //funcion que utiliza servidor si los datos introducidos son incorrectos 
    function malIniciado() {
        console.log("iniciamos el metodo del mal logeo");
        mensajeInicio.innerHTML = "El correo o la contraseña no son correctos";
        mensajeInicio.style.transition = "0.5s";
        mensajeInicio.style.color = "tomato";
        zonaInvitado.style.marginTop = "144px";
        setTimeout(function () {
            mensajeInicio.innerHTML = "";
            zonaInvitado.style.marginTop = "200px";
        }, 5000);
    }

    function nickExiste() {
        mensajeRegistro.innerHTML = "Este nick ya esta registrado";
        mensajeRegistro.style.transition = "0.5s";
        mensajeRegistro.style.color = "tomato";
        zonaInvitado.style.marginTop = "160px";
        document.getElementsByName("usernameR")[0].focus();
        setTimeout(function () {
            mensajeRegistro.innerHTML = "";
            zonaInvitado.style.marginTop = "200px";
        }, 3000);
    }

    function cambiarFondoRegistro() {
        var fondo = document.getElementById("fondo");
        var fondos = ["fondoVerano1.png", "fondoNevado2.png", "fondoVerano2.png", "fondoPersonaje.png"];
        var pos = 0;
        setInterval(function () {
            fondo.style.backgroundImage = `url(../assets/imagenes/estilo/${fondos[pos]})`;
            pos = pos == fondos.length - 1 ? 0 : pos + 1;
        }, 10000);
    }

    cambiarFondoRegistro();

}