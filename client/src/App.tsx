import { useEffect, useMemo, useState } from "react";
import Board, { BoardType } from "./features/Board/Board";
import { BoardCellType } from "./features/Board/BoardCell";
import { Main, Side, Wrapper } from "./styled";
import PlayersSidebar from "./features/PlayersSidebar/PlayersSidebar";
import { Socket, io } from "socket.io-client";

type PlayerType = {
  id: string | number;
  name: string;
  color: string;
  figure: "x" | "o";
};

type UserType = PlayerType;

const socket = io("/", {
  autoConnect: false,
});

function App() {
  const [game, setGame] = useState<any>(null);
  const [board, setBoard] = useState<BoardType>([]);
  const [user, setUser] = useState<UserType | null>(null);
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | number>();

  const canSign = (cell: BoardCellType) => {
    return (
      players.length === 2 &&
      cell.value === undefined &&
      game.boardWinStatus.length === 0 &&
      !!user &&
      game.nextMovePlayerId === user.id
    );
  };

  const currentPlayer: PlayerType | undefined = useMemo(() => {
    return players.find((p) => p.id === currentPlayerId);
  }, [players, currentPlayerId]);

  const onPlayerCellClick = (cellId: number) => {
    const cell = board.find((cell) => cell.id === cellId);
    const player = players.find((p) => p.id === game.nextMovePlayerId);

    //console.log("canSign: ", canSign(cell!), cell, user, game);

    if (!cell || !player) return;
    if (!canSign(cell)) return;

    socket.emit("move", cellId);
  };

  const onRestartClick = () => {
    //console.log(game);
    if (game.boardWinStatus.length !== 3) return;
    console.log("Restarting game");
    socket.emit("new_game");
  };

  useEffect(() => {
    const board: BoardType = new Array(9)
      .fill(undefined)
      .map((_, idx) => ({ id: idx }));

    setBoard(board);

    const onConnect = () => {
      console.log("connect: ", socket);
    };

    const onConnection = (socket: Socket) => {
      console.log("connection: ", socket);
    };

    const onJoinedGame = (data: any) => {
      try {
        const game = JSON.parse(data);

        //console.log("joined_game: ", game);

        setGame(game);
        setPlayers(game.players);
        setCurrentPlayerId(game.nextMovePlayerId);
        setUser(game.players.find((p: any) => p.id === game.me.id));
      } catch (e) {
        console.log(e);
      }
    };

    const onGameUpdate = (data: any) => {
      //console.log("game_update: ", JSON.parse(data));
      const _newGameObj = JSON.parse(data);

      setGame((game: any) => {
        return {
          ..._newGameObj,
          me: { ...(game?.me || null) },
        };
      });

      const _newPlayers = _newGameObj.players.map(
        (p: PlayerType, idx: number) => ({
          ...p,
          color: idx === 0 ? "blue" : "green",
        })
      );

      setPlayers(_newPlayers);
      const colorFigureMap = _newPlayers.reduce((map: any, player: any) => {
        map[player.figure] = {
          color: player.color,
          playerId: player.id,
        };

        return map;
      }, {});

      /* console.log("figureColorMap: ", colorFigureMap);
        console.log('Old board: ', board); */

      const newBoard = _newGameObj.board.map((figure: any, idx: number) => {
        const _cell = board[idx];
        //if (!figure) return _cell;
        const color = figure ? colorFigureMap[figure].color : undefined;
        const playerId = figure ? colorFigureMap[figure].playerId : undefined;

        _cell.value = figure || undefined;
        _cell.color = color;
        _cell.playerId = playerId;

        return { ..._cell };
      });
      console.log("Setting new board: ", newBoard);
      setBoard(newBoard);
    };

    socket.on("joined_game", onJoinedGame);
    socket.on("game_update", onGameUpdate);
    socket.on("reconnect", (p) => console.log("reconnect: ", p));
    socket.on("error", (error) => console.log("error: ", error));
    socket.once("connection", onConnection);
    socket.once("connect", onConnect);

    socket.connect();

    return () => {
      socket.off("connection", onConnection);
      socket.off("connect", onConnect);
      socket.off("joined_game", onJoinedGame);
      socket.off("game_update", onGameUpdate);

      socket.disconnect();
    };
  }, []);

  console.log(game, board, players, user);

  return (
    <Wrapper style={{ width: "100%", height: "100%", margin: 0, padding: 0 }}>
      <Main>
        {!!currentPlayer && board.length === 9 && !!game && (
          <Board
            disabled={user?.id !== game.nextMovePlayerId || players.length < 2}
            board={board}
            boardValidationState={game.boardWinStatus}
            onPlayerCellClick={onPlayerCellClick}
          />
        )}
        <Side container item>
          {!!game && players && (
            <PlayersSidebar
              onRestartClick={onRestartClick}
              enableRestart={game.boardWinStatus.length === 3}
              score={game.score}
              nextMovePlayerId={game.nextMovePlayerId}
              me={game?.me}
              players={players}
            />
          )}
        </Side>
      </Main>
    </Wrapper>
  );
}

export default App;
