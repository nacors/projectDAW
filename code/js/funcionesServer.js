
exports.getAllplayers = function(io){
    var players = [];
    var clientes = io.of('/').in('sala1').clients((error, clients) => {
        if (error) throw error;
        // Returns an array of client IDs like ["Anw2LatarvGVVXEIAAAD"]
        return clients; 
      });

      for(cliente in clientes.sockets){
          players.push(io.sockets.connected[cliente].player);
      }
      console.log(players);
      return players;
}

exports.playersCount = function(io){
    var clientes = io.of('/').in('sala1').clients((error, clients) => {
        if (error) throw error;
        // Returns an array of client IDs like ["Anw2LatarvGVVXEIAAAD"]
        return clients; 
      });
      return clientes.server.eio.clientsCount;
}