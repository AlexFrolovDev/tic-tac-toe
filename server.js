const express = require("express");
/* const cors = require("cors");
const cookieParser = require("cookie-parser"); */
const { createServer } = require("http");
const { Server } = require("socket.io");
const Manager = require("./Manager");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "client", "build")));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const onConnection = (socket) => {
  console.log("Connected: ", socket.id);
  const playerId = socket.id;
  const game = Manager.getGameWithFreeSlots();
  game.addPlayer({ id: playerId, name: `` });
  //game.addPlayer({ id: 'PC', name: `` });

  game.restartGame();

  socket.on("disconnect", () => {
    console.log("Disconnected: ", playerId);
    const newGame = game.removePlayer(playerId);
    newGame.restartGame();
    if (newGame.players.length === 0) {
      console.log("Removing game: ", newGame.id);
      Manager.removeGame(newGame.id);
    } else {
      newGame.updatePlayer({ ...newGame.players[0], name: `` });
      io.to(game.id).emit(
        "game_update",
        JSON.stringify({ ...newGame, ts: new Date() })
      );
    }
  });

  socket.on("move", (index) => {
    console.log("move: ", index);
    let newGame = game.playerMove({
      playerId: playerId,
      cellIndex: parseInt(index),
    });

    //console.log("After move: ", newGame);
    io.to(game.id).emit(
      "game_update",
      JSON.stringify({ ...newGame, ts: new Date() })
    );

    /* if (newGame.winnerId !== playerId) {
      newGame = game.pcMove();
      io.to(game.id).emit(
        "game_update",
        JSON.stringify({ ...newGame, ts: new Date() })
      );
    } */
  });

  socket.on("new_game", () => {
    console.log("Restarting game. Game status: ", game.boardWinStatus);
    if (game.boardWinStatus.length !== 3) {
      console.log("Game is not over yet !", game.boardWinStatus.length);
      return;
    } else {
    }
    const _newGame = game.restartGame();

    console.log("New game board: ", _newGame.board);

    io.to(game.id).emit(
      "game_update",
      JSON.stringify({ ..._newGame, ts: new Date() })
    );
  });

  socket.join(game.id);

  socket.emit(
    "joined_game",
    JSON.stringify({ ...game, me: { id: playerId }, ts: new Date() })
  );

  io.to(game.id).emit(
    "game_update",
    JSON.stringify({ ...game, ts: new Date() })
  );
};

io.on("connection", onConnection);

httpServer.listen(5000);
