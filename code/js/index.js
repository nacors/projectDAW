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
    cambiarFondoRegistro();

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
        if (isInicioSesionCorrecto()) {
            $.ajax({
                type: 'GET',
                url: '/iniciar',
                data: { nick: nombre, contr: contr },
                success: function (taken) {
                    if (taken.ok === false) {
                        console.log("false");
                        malIniciado();
                    } else {
                        sessionStorage.setItem('usuario', nombre);
                        window.location = "/menu";
                    }
                }, error: function (xhr, status) {
                    console.log(status);
                    console.log(xhr);
                    alert('!!!!!!ajax!!!!!!!');
                },
            });
        }
    });

    //si nos queremos registrar
    botonRegistrarse.addEventListener("click", function (e) {
        var nombre = document.getElementsByName("usernameR")[0].value;
        var contr = document.getElementsByName("passwordR")[0].value;
        e.preventDefault();
        if (isRegistroCorrecto()) {
            $.ajax({
                type: 'GET',
                url: '/registrar',
                data: { nick: nombre, contr: contr },
                success: function (taken) {
                    if (taken.ok === false) {
                        console.log("false");
                        nickExiste();
                    } else {
                        sessionStorage.setItem('usuario', nombre);
                        window.location = "/menu";
                    }
                }, error: function (xhr, status) {
                    console.log(status);
                    console.log(xhr);
                    alert('!!!!!!ajax!!!!!!!');
                },
            });
        }
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
        mensajeInicio.style.opacity = "1";
        // mensajeInicio.style.transition = "0.5s";
        // mensajeInicio.style.color = "tomato";
        zonaInvitado.style.marginTop = "144px";
        setTimeout(function () {
            mensajeInicio.style.opacity = "0";
            mensajeInicio.innerHTML = "Vuelve a intentarlo";
            // zonaInvitado.style.marginTop = "200px";
        }, 5000);
    }

    function nickExiste() {
        mensajeRegistro.innerHTML = "Este nick ya esta registrado";
        mensajeRegistro.style.opacity = "1";
        zonaInvitado.style.marginTop = "164px";
        document.getElementsByName("usernameR")[0].focus();
        setTimeout(function () {
            mensajeRegistro.style.opacity = "0";
            // mensajeRegistro.innerHTML = "";
            // zonaInvitado.style.marginTop = "200px";
        }, 3000);
    }

    function cambiarFondoRegistro() {
        var fondo = document.getElementById("fondo");
        var fondos = ["fondoVerano2.png", "fondoNevado2.png", "fondoBosque1.jpg", "fondoBosque2.jpg", "fondoCueva1.jpg", "fondoCueva2.jpg"];
        var pos = 0;
        setInterval(function () {
            fondo.style.backgroundImage = `url(../assets/imagenes/estilo/${fondos[pos]})`;
            pos = pos == fondos.length - 1 ? 0 : pos + 1;
        }, 10000);
    }

    function isInicioSesionCorrecto() {
        var nombre = document.getElementsByName("usernameI")[0].value;
        var contr = document.getElementsByName("passwordI")[0].value;
        if (nombre != "" && contr != "") {
            return true;
        } else {
            mensajeInicio.innerHTML = "Te faltan campos por rellenar";
            mensajeInicio.style.opacity = "1";
            zonaInvitado.style.marginTop = "164px";
            setTimeout(function () {
                mensajeInicio.style.opacity = "0";
                //mensajeInicio.innerHTML = "";
                //zonaInvitado.style.marginTop = "200px";
            }, 3000);
            return false;
        }
    }

    function isRegistroCorrecto() {
        var nombre = document.getElementsByName("usernameR")[0].value;
        var contr = document.getElementsByName("passwordR")[0].value;
        if (nombre != "" && contr != "") {
            return true;
        } else {
            mensajeRegistro.innerHTML = "Te faltan campos por rellenar";
            mensajeRegistro.style.opacity = "1";
            zonaInvitado.style.marginTop = "164px";
            setTimeout(function () {
                mensajeRegistro.style.opacity = "0";
                //zonaInvitado.style.marginTop = "200px";
                //mensajeRegistro.innerHTML = "";
            }, 3000);
            
            
            return false;
        }
    }

    botonesInvitado.addEventListener("click", function(e){
        sessionStorage.setItem('usuario', 'Invitado');
    });

}