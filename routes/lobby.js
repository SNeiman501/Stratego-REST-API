// const color = '#0000ff';
const color = "#ffd700ff";
// const color = '#ffd700A8';
// const color = '#ffd70054';

function lobby(io, mapLocalToPlayer) {
  io.on("connection", (sock) => {
    let key;
    let isPlayerTwo;

    sock.on("playerKey", (playerKey) => {
      key = playerKey;
      sock.emit("message", `You Are ${key}`);
      console.log("key en key: ", key);
    });

    sock.on("connectionId", (playerKey) => {
      sock.broadcast.emit("message", `Player ${key} connected`);
    });

    /*mensaje que recibo del cliente x y lo replico en los demás conectados*/
    //io.emit: para todos incluido el que lo envió
    sock.on("message", (text) => {
      try {
        io.emit("message", text);
        let playerMap = mapLocalToPlayer.find(
          ({ playerKey }) => playerKey == key
        );
        isPlayerTwo=(playerMap.playerSlot===2);
        let mapAndPlayer = [playerMap.map, isPlayerTwo];
        sock.emit("map", mapAndPlayer);
        console.log({ isPlayerTwo });
      } catch {}
    });

    //mostramos coord marcada a los demás
    sock.on("turnBoard", (lastFourMovesSock) =>
      io.emit("turnBoard", { lastFourMovesSock, color })
    );

    // Función para traer el tablero por medio de los movimientos.
    sock.on("mapBoard", () => {
      let playerMap = mapLocalToPlayer.find(
        ({ playerKey }) => playerKey == key
      );
      console.log('playerMap.Map');
      console.log(playerMap.map);
      io.emit("mapBoard", playerMap.map);
    });
  });
}

module.exports = lobby;
