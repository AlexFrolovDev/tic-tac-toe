const { v4: uuidv4 } = require("uuid");
const GameClass = require("./Game");

class Manager {
  constructor() {
    this.games = {};

    setInterval(() => {
      const today = new Date();
      const ids = [];
      Object.entries(this.games).forEach(([gameId, game]) => {
        if (Math.abs(today - game.lastAccess) / 36e5 > 1) {
          ids.push(gameId);
        }
      });

      ids.forEach((id) => {
        this.removeGame(id);
      });
    }, 36e5);
  }

  addGame() {
    const newGame = new GameClass();
    this.games[newGame.id] = newGame;

    return this.games[newGame.id];
  }

  removeGame(id) {
    delete this.games[id];
  }

  getGame(id) {
    return this.games[id];
  }

  getGameWithFreeSlots() {
    return (
      Object.values(this.games).find((g) => g.players.length === 0) ||
      Object.values(this.games).find((g) => g.players.length === 1) ||
      this.addGame()
    );
  }
}

const ManagerInstance = new Manager();

module.exports = ManagerInstance;
