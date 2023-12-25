import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import Button from "@mui/material/Button";

import {
  ActivePlayerArrow,
  Contents,
  Header,
  PlayerRow,
  PlayerTitle,
  Wrapper,
} from "./styled";

const PlayersSidebar = ({
  players = [],
  me = { id: "" },
  nextMovePlayerId,
  score = {},
  enableRestart = false,
  onRestartClick = () => {},
}: {
  players: any[];
  me: { id: string };
  nextMovePlayerId: string;
  score: any;
  enableRestart: boolean;
  onRestartClick: () => void;
}) => {
  //console.log(players, me, score);
  return (
    <Wrapper>
      <Header>
        {players.length < 2 && (
          <PlayerRow active={false}>
            <b>Waiting For Opponent...</b>
          </PlayerRow>
        )}
        {players.map((player) => {
          return (
            <PlayerRow active={nextMovePlayerId === player.id} key={player.id}>
              <span style={{ color: player.color }}>
                {player.figure === "x" ? (
                  <CloseOutlinedIcon />
                ) : (
                  <CircleOutlinedIcon />
                )}
              </span>
              <PlayerTitle active={nextMovePlayerId === player.id}>
                {player.id === me.id ? "Me" : "Opponent"}
              </PlayerTitle>
              {player.id === nextMovePlayerId && players.length === 2 && (
                <ActivePlayerArrow />
              )}
            </PlayerRow>
          );
        })}
        <hr />
      </Header>
      <Contents>
        <h3>Score</h3>
        <div style={{ fontWeight: "bold" }}>Me: {score[me.id] || 0}</div>
        <div>
          Opponent: {score[players.find((p) => p.id !== me.id)?.id] || 0}
        </div>
        <hr />
      </Contents>
      {enableRestart && (
        <Button onClick={onRestartClick} variant="contained">
          Restart
        </Button>
      )}
    </Wrapper>
  );
};

export default PlayersSidebar;
