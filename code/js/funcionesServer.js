//Devolvemos la sala a la que está conectado este usuario
//con socket.adapter.sids[id del socket] obtenemos en que room se encuentra
exports.getRoom = function (socket){
    var count = 0;
    var identifi = socket.id;
    rooms = socket.adapter.sids[identifi];
    for(let room in rooms){
        if(count == 1) return room;
        count++;
    }
}
