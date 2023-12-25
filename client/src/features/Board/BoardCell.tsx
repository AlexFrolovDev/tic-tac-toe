import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import {
  BoardCellBack,
  BoardCellContents,
  BoardCellFront,
  BoardCellWrapper,
} from "./styled";
import React, { forwardRef, useCallback, useEffect, useRef } from "react";

type GeneralBoardCellType = {
  id: number;
  value?: "x" | "o";
  color?: string;
  playerId?: string;
};

export type UnsignedBoardCellType = GeneralBoardCellType & {
  value?: never;
};

export type SignedBoardCellType = GeneralBoardCellType & {
  value: "x" | "o";
  color: string;
  playerId: string;
};

export type BoardCellType = UnsignedBoardCellType | SignedBoardCellType;

type BoardCellProps = {
  onCellClick: (cellIdx: number) => void;
  strike: boolean;
  id: number;
  value?: "x" | "o";
  color?: string;
  disabled?: boolean;
};
const BoardCell = (props: BoardCellProps) => {
  const { onCellClick = (id: number) => {}, ...rest } = props;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = () => {
      onCellClick(rest.id);
    };
    const _ref = ref.current;

    _ref?.addEventListener("click", onClick);

    return () => {
      _ref?.removeEventListener("click", onClick);
    };
  }, [onCellClick, rest.id]);

  return <BoardCellPure {...rest} ref={ref} />;
};

type BoardCellPureProps = Omit<BoardCellProps, "onCellClick">;

const BoardCellPure = React.memo(
  forwardRef(
    (
      { color, value, strike, disabled }: BoardCellPureProps,
      ref: React.ForwardedRef<HTMLDivElement>
    ) => {
      const getCellContents = () => {
        if (value === "x") {
          return <CloseOutlinedIcon className={color} />;
        }

        if (value === "o") {
          return <CircleOutlinedIcon className={color} />;
        }

        return null;
      };

      //console.log(id, value, color);

      return (
        <BoardCellWrapper
          ref={ref}
          className={`${typeof value !== "undefined" ? "signed" : ""} ${
            strike ? "strike" : ""
          } ${disabled ? "disabled" : ""}`}
          item
        >
          <BoardCellContents>
            <BoardCellFront></BoardCellFront>
            <BoardCellBack>{getCellContents()}</BoardCellBack>
          </BoardCellContents>
        </BoardCellWrapper>
      );
    }
  )
);

export default BoardCell;
