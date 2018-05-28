window.onload = () => {
    if (sessionStorage.getItem("usuario") == null) {
        sessionStorage.setItem("usuario", "Invitado");
    }
    document.getElementById("nickJugador").innerHTML = sessionStorage.getItem("usuario");
    cambiarFondoRegistro();
    var info = document.getElementById("informacion");
    abrirPestañaJugar(document.getElementById("jugarJuego"));


    document.getElementById("jugarJuego").addEventListener("click", function (e) {
        reiniciarColoresBotones();
        abrirPestañaJugar(this);
    });

    document.getElementById("cerrarSesion").addEventListener("click", function () {
        reiniciarColoresBotones();
        this.style.background = "#6c5ce7";
        info.innerHTML = "<h3>¿Seguro que quieres salir?<br>";
        info.innerHTML += "<a id='salir' href='/'>Salir</a>&nbsp";
        info.innerHTML += "<a id='noSalir' href=''>Cancelar</a>";
        document.getElementById("noSalir").addEventListener("click", function (e) {
            e.preventDefault();
            reiniciarColoresBotones();
            document.getElementById("jugarJuego").style.background = "#6c5ce7";
            info.innerHTML = "<h3>Atención, el emparejamiento es aleatorio. Para buscar una sesión presiona el botón de abajo</h3><br>";
            info.innerHTML += "<div id='imagenJuego'></div>";
            info.innerHTML += "<a id='enlacePartidaJ' href='/jugar'>JUGAR</a>";
            document.getElementById("enlacePartidaJ").addEventListener("click", function (e) {
                e.preventDefault();
                window.location = "/juego";
            });
        });
        document.getElementById("salir").addEventListener("click", function (e) {
            sessionStorage.setItem('usuario', "invitado");
        });
    });

    document.getElementById("clasificacion").addEventListener("click", function () {
        reiniciarColoresBotones();
        this.style.background = "#6c5ce7";
        info.innerHTML = "<div id='clasificacionInfo'></div>";
        // console.log(sessionStorage.getItem("usuario"));
        if (sessionStorage.getItem("usuario") == "Invitado" || sessionStorage.getItem("usuario") == null) {
            info.innerHTML = ("<h2><a href='/'>Registrate</a> o <a href='/'>Inicia Sesón</a> para ver las clasificaciones</h2>");
        } else {
            imprimirTuClasificacion();
            imprimirClasificacionGeneral();
        }
    });

    document.getElementById("reglas").addEventListener("click", function () {
        reiniciarColoresBotones();
        this.style.background = "#6c5ce7";
        info.innerHTML = `  <div id="reglasGenereales"></div>`;
        document.getElementById("reglasGenereales").innerHTML = `<div id="reglasJuego">
                    <h2>Reglas</h2>
                    <h3><b id="enumeracion">1.</b> Elimina a tu enemigo para poder avanzar y ganar</h3>
                    <h3><b id="enumeracion">2.</b> Sigue a la flecha que te indica la dirección</h3>
                    <h3><b id="enumeracion">3.</b> Utiliza pociones para ganar más velocidad</h3>
                    <h3><b id="enumeracion">4.</b> Salta con doble salto</h3>
                    <h3><b id="enumeracion">5.</b> No caigas fuera del mapa, ten ciudado!</h3>
                </div>`;
        document.getElementById("reglasGenereales").innerHTML += `<div id="reglasImg">
                    <h2>Controles</h2>
                    <h3><b id="enumeracion">1.</b> Para moverte usa W(salto), A(izquierda) y D(derecha)</h3>
                    <h3><b id="enumeracion">2.</b> Ataca con la tecla de K y L</h3>
                    <div id="imagenFlechas"></div>
            </div>`;

    });
    document.getElementById("info").addEventListener("click", function () {
        reiniciarColoresBotones();
        this.style.background = "#6c5ce7";
        info.innerHTML = "<h3>El juego ha sido desarollado como un proyecto final para el curso de Grado Superior DAW 2</h3>";
        info.innerHTML += "<h3>El lenguaje principal del juego es JavaScript y se utilizarón tecnologias y librerias como</h3>";
        info.innerHTML += "<h3><a href='https://phaser.io/'>PHASER</a>, <a href='https://nodejs.org/es/'>NODEJS</a>, <a href='https://socket.io/'>SOCKET.IO</a>, <a href='https://www.mongodb.com/'>MONGODB</a> y <a href='https://jquery.com/'>JQUERY</a></h3><br>";
        info.innerHTML += "<h3>Si te interesa, puedes consultar el codigo en el siguiente enlace</h3>";
        info.innerHTML += "<a id='enlacecODIGO' href='https://github.com/nacors/projectDAW'>GitHub Codigo</a>";
    });

    document.getElementById("creadores").addEventListener("click", function () {
        reiniciarColoresBotones();
        this.style.background = "#6c5ce7";
        info.innerHTML = "<h3>Nacor: </h3>&nbsp<a id='nacor' href='https://github.com/nacors'>GitHub Nacor</a><br>";
        info.innerHTML += "<h3>Isayenko: </h3>&nbsp<a id='ivan' href='https://github.com/ivanisayenko'>GitHub Ivan</a><br>";
    });

    function reiniciarColoresBotones() {
        document.getElementById("jugarJuego").style.background = "#a29bfe";
        document.getElementById("clasificacion").style.background = "#a29bfe";
        document.getElementById("reglas").style.background = "#a29bfe";
        document.getElementById("info").style.background = "#a29bfe";
        document.getElementById("creadores").style.background = "#a29bfe";
        document.getElementById("cerrarSesion").style.background = "#a29bfe";
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

    function imprimirTuClasificacion() {
        $.ajax({
            type: 'GET',
            url: '/miClasificacion',
            data: { nick: sessionStorage.getItem("usuario") },
            beforeSend: function () {
                document.getElementById("clasificacionInfo").innerHTML = `  
                <div id='clasificacionPersonal'><div id="cargando"></div></div>`;
            },
            success: function (taken) {
                document.getElementById("clasificacionPersonal").innerHTML = `<h4>Datos Personales</h4>`;
                document.getElementById("clasificacionPersonal").innerHTML += `<div>Nick: <b>${taken.nickname}</b></div>
                                    <div>Clasificación: <b>${taken.clasificacion}</b></div>
                                    <div>Partidas Ganadas: <b>${taken.partidasGanadas}</b></div>
                                    <div>Partidas Jugadas: <b>${taken.partidasJugadas}</b></div>
                                    <div>Enemigos Eliminados: <b>${taken.enemigosEliminados}</b></div>`;
            }, error: function (xhr, status) {
                console.log(status);
                console.log(xhr);
                alert('!!!!!!ajax!!!!!!!');
            },
        });
    }
    function imprimirClasificacionGeneral() {
        $.ajax({
            type: 'GET',
            url: '/clasificacionGeneral',
            beforeSend: function () {
                document.getElementById("clasificacionInfo").innerHTML += `  
                <div id='clasificacionGlobal'><div id="cargando"></div></div>`;
            },
            success: function (taken) {
                // console.log(taken);
                document.getElementById("clasificacionGlobal").innerHTML = `<h4>Clasificación General</h4>`;
                for (let resultado = 0; resultado < 5; resultado++) {
                    if (resultado == 0) {
                        document.getElementById("clasificacionGlobal").innerHTML += `<div>${parseInt(resultado) + 1}. <b>${taken[resultado].nickname}</b>, puntos: <b>${taken[resultado].clasificacion}</b></div>`;
                    } else {
                        document.getElementById("clasificacionGlobal").innerHTML += `<div>${parseInt(resultado) + 1}. <b>${taken[resultado].nickname}</b>, puntos: <b>${taken[resultado].clasificacion}</b></div>`;
                    }
                }
            }, error: function (xhr, status) {
                console.log(status);
                console.log(xhr);
                alert('!!!!!!ajax!!!!!!!');
            },
        });
    }

    function abrirPestañaJugar(pestaña) {
        pestaña.style.background = "#6c5ce7";
        info.innerHTML = "<h3>Atención, el emparejamiento es aleatorio. Para buscar una sesión presiona el botón de abajo</h3>";
        info.innerHTML += "<h3>La elección del mapa tambien es aleatoria!</h3>";
        info.innerHTML += "<div id='imagenJuego'></div>";
        info.innerHTML += "<a id='enlacePartida' href='/jugar'>JUGAR</a>";
        document.getElementById("enlacePartida").addEventListener("click", function (e) {
            e.preventDefault();
            window.location = "/juego";
        });
    }
}