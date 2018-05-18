window.onload = () => {
    document.getElementById("nickJugador").innerHTML = sessionStorage.getItem("usuario");

    cambiarFondoRegistro();

    var info = document.getElementById("informacion");
    document.getElementById("jugarJuego").addEventListener("click", function (e) {
        reiniciarColoresBotones();
        this.style.background = "#6c5ce7";
        info.innerHTML = "<h3>Atención, el emparejamiento es aleatorio. Para buscar una sesión presiona el botón de abajo</h3><br>";
        info.innerHTML += "<div id='imagenJuego'></div>";
        info.innerHTML += "<a id='enlacePartida' href='/jugar'>JUGAR</a>";
        document.getElementById("enlacePartida").addEventListener("click", function (e) {
            e.preventDefault();
            window.location = "/juego";
        });
    });

    document.getElementById("cerrarSesion").addEventListener("click", function () {
        reiniciarColoresBotones();
        this.style.background = "#6c5ce7";
        info.innerHTML = "<h3>¿Seguro que quieres salir?<br>";
        info.innerHTML += "<a id='salir' href='/'>Salir</a>&nbsp";
        info.innerHTML += "<a id='noSalir' href=''>Cancelar</a>";
        document.getElementById("noSalir").addEventListener("click", function (e) {
            e.preventDefault();
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
        info.innerHTML = "<h3>Aqui en un futuro no muy lejano, eso espero, habra clasficación de los mejores jugadores</h3><br>";
    });

    document.getElementById("reglas").addEventListener("click", function () {
        reiniciarColoresBotones();
        this.style.background = "#6c5ce7";
        info.innerHTML = "<h3>1. Debes de llegar al final del mapa del lado enemigo para ganar la partida</h3>";
        info.innerHTML += "<h3>2. Para avanzar debes eliminar a tu enemigo</h3>";
        info.innerHTML += "<h3>3. Puedes utilizar pociones para ganar más velocidad o ser invencible</h3>";
        info.innerHTML += "<h3>4. Ten cuidado al no caerte fuera del mapa!</h3>";
        info.innerHTML += "<h3>5. Control muy fácil, muevete con las flechas <div id='imagenFlechas'></div></h3>";
        info.innerHTML += "<h3>6. Pega con X y C</h3>";
        info.innerHTML += "<h3>7. Disfruta!!!</h3><br>";
    });
    document.getElementById("info").addEventListener("click", function () {
        reiniciarColoresBotones();
        this.style.background = "#6c5ce7";
        info.innerHTML = "<h3>El juego ha sido desarollado como un proyecto final para el curso de Grado Superior DAW 2</h3><br>";
        info.innerHTML += "<h3>El lenguaje principal del juego es JavaScript y se utilizarón tecnologias y librerias como</h3><br>";
        info.innerHTML += "<h3>PHASER, NODEJS, SOCKET.IO, MONGODB y JQUERY</h3><br>";
        info.innerHTML += "<h3>Si te interesa, puedes consultar el codigo en el siguiente enlace</h3><br>";
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
}