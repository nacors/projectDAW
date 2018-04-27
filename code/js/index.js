window.onload = () => {
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
        alert("jugar como usuario registrado (acabar)");
        Client.iniciarSesion();
    });
    document.getElementsByName("registrar")[0].addEventListener("click", function (e) {
        e.preventDefault();
        alert("jugar como usuario recien registrado (acabar)");
    });
    document.getElementById("accionIniciarSesion").addEventListener("click", function () {
        this.style.display = "none";
        document.getElementById("iniciarSesion").style.display = "grid";
        document.getElementById("registrarse").setAttribute("style", "display: none !important");
        document.getElementById("accionRegistrar").setAttribute("style", "display: inline");
    });

    var Client = {};
    Client.socket = io.connect();
    Client.askNewPlayer = function(){
        Client.socket.emit('newplayer');
    };
    Client.iniciarSesion = function(nick, cont){
        Client.socket.emit('iniciarSesion', {nick:"isayenko", cont:1234});
    }

    Client.askNewPlayer();
}