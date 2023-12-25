const { v4: uuidv4 } = require("uuid");
const PlayerClass = require("./Player");

module.exports = class GameClass {
  constructor() {
    const today = new Date();

    this.id = uuidv4();
    this.created = today;
    this.lastAccess = today;
    this.players = [];
    this.board = this.generateBoard();
    this.nextMovePlayerId = null;
    this.boardWinStatus = [];
    this.winnerId = null;
    this.score = {};
  }

  generateBoard() {
    return new Array(9).fill();
  }

  restartGame() {
    const today = new Date();

    this.lastAccess = today;
    this.board = this.generateBoard();
    this.boardWinStatus = [];
    this.winnerId = null;

    if (this.players.length === 1) {
      this.nextMovePlayerId = this.players[0].id;
    } else if (this.players.length === 2) {
      this.nextMovePlayerId = this.players.find(
        (p) => p.id !== this.nextMovePlayerId
      ).id;
    } else {
      this.nextMovePlayerId = null;
    }

    return this;
  }

  validateBoard() {
    this.boardWinStatus = validateBoard(this.board);
    console.log("boardWinStatus: ", this.boardWinStatus);
  }

  canMove(cellIndex, playerId) {
    if (
      this.players.length !== 2 ||
      this.board[cellIndex] !== undefined ||
      this.boardWinStatus.length === 3 ||
      this.nextMovePlayerId !== playerId ||
      !!this.winnerId
    )
      return false;

    return true;
  }

  getPlayer(playerId) {
    return this.players.find((p) => p.id === playerId);
  }

  addPlayer({ id, name }) {
    if (this.players.length === 2) throw new Error("No room for new player");

    const newPlayer = new PlayerClass({
      id,
      name,
    });

    this.players.push(newPlayer);
    this.players.forEach((player, idx) => {
      player.figure = idx === 0 ? "x" : "o";
    });
    this.nextMovePlayerId = this.players[0].id;
    this.lastAccess = new Date();

    if (this.players.length === 2) {
      this.score = this.players.reduce((acc, curr) => {
        return {
          ...acc,
          [curr.id]: 0,
        };
      }, {});
    }

    if (this.getPcPlayer()) {
      this.nextMovePlayerId = this.getPcPlayer().id;
    }

    return this;
  }

  getPcPlayer() {
    return this.players.find((p) => p.id === "PC");
  }

  updatePlayer(obj) {
    const { id } = obj;
    let player = this.getPlayer(id);
    if (!player) throw new Error("Player not found");

    //console.log('Updating player: ', obj)
    player = { ...obj };
    //console.log('Updated player: ', this.getPlayer(id))
  }

  removePlayer(playerId) {
    this.players = this.players.filter((p) => p.id !== playerId);

    this.lastAccess = new Date();

    return this;
  }

  pcMove() {
    const options = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    const pc = this.getPlayer("PC");
    const player = this.players.find((p) => p.id !== "pc");
    if (!pc || !player) return;

    let cellIndex = -1;
    let optionRow = -1;
    let emptyPerRow = [];

    options.forEach((optionsRow, idx) => {
      let empty = 0;
      optionsRow.forEach((_) => {
        if (this.board[_] === undefined) {
          empty++;
        }
      });
      emptyPerRow.push(empty);
    });

    optionRow = emptyPerRow.sort().reverse()[0];
    cellIndex = options[optionRow].find((_) => !this.board[_]);

    return this.playerMove({ playerId: "PC", cellIndex });
  }

  playerMove({ playerId, cellIndex }) {
    console.log("Making a move: ", playerId, cellIndex, this.board);
    const player = this.getPlayer(playerId);
    if (!player) throw new Error("Player not found");
    if (!this.canMove(cellIndex, playerId))
      throw new Error("Cannot make a move");

    this.board[cellIndex] = player.figure;
    this.validateBoard();
    this.lastAccess = new Date();
    this.nextMovePlayerId = this.players.find((p) => p.id !== playerId).id;

    if (this.boardWinStatus.length === 3) {
      this.score[playerId]++;
      this.winnerId = playerId;
    }

    return this;
  }
};

const validateBoard = (board) => {
  let result = new Set();

  if (board.every((cell) => cell === undefined)) return result;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      if (
        board[i * 3 + j] !== undefined &&
        board[i * 3 + j] === board[i * 3 + j + 1]
      ) {
        result.add(i * 3 + j);
        result.add(i * 3 + j + 1);
      }
    }
    if (result.size === 3) {
      return Array.from(result);
    } else {
      result = new Set();
    }
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 1; j < 3; j++) {
      if (board[i] !== undefined && board[i] === board[j * 3 + i]) {
        result.add(i);
        result.add(j * 3 + i);
      }
    }
    if (result.size === 3) {
      return Array.from(result);
    } else {
      result = new Set();
    }
  }

  result.add(0);
  for (let i = 0; i < 3; i++) {
    if (board[i * 4] === board[0] && board[0] !== undefined) {
      result.add(i * 4);
    }
  }

  if (result.size === 3) {
    return Array.from(result);
  } else {
    result = new Set();
  }

  result.add(2);
  for (let i = 1; i < 3; i++) {
    if (board[2] !== undefined && board[2] === board[i * 3 + 2 - i]) {
      result.add(i * 3 + 2 - i);
    }
  }

  if (result.size === 3) {
    return Array.from(result);
  }

  return [];
};
