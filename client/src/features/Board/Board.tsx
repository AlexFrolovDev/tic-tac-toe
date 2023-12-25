import { BoardContents, BoardRow, BoardWrapper } from "./styled";
import BoardCell, {
  SignedBoardCellType,
  UnsignedBoardCellType,
} from "./BoardCell";

export type BoardType = (UnsignedBoardCellType | SignedBoardCellType)[];

export type BoardPropsType = {
  onPlayerCellClick: (cellId: number) => void;
  board: BoardType;
  boardValidationState: number[];
  disabled: boolean;
};

const Board = ({
  board,
  boardValidationState,
  disabled,
  onPlayerCellClick,
}: BoardPropsType) => {
  const drawBoard = () => {
    return board.map((_, idx) => {
      if (idx % 3 === 0) {
        return (
          <BoardRow key={idx} container item>
            {board.slice(idx, idx + 3).map((cell) => {
              //console.log(cell, disabled);
              return (
                <BoardCell
                  strike={boardValidationState.includes(cell.id)}
                  disabled={
                    disabled ||
                    !!cell.value ||
                    boardValidationState.length === 3
                  }
                  key={cell.id}
                  id={cell.id}
                  color={cell.color}
                  value={cell.value}
                  onCellClick={onPlayerCellClick}
                />
              );
            })}
          </BoardRow>
        );
      }
      return null;
    });
  };

  return (
    <BoardWrapper container>
      <BoardContents item container>
        {drawBoard()}
      </BoardContents>
    </BoardWrapper>
  );
};

export default Board;
