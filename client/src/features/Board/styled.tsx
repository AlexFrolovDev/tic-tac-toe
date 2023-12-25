import { Grid, GridTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import styled, { keyframes } from "styled-components";

const GradientAnimation = keyframes`
    0% {
          background-position: 0% 25%;
        }
        25% {
          background-position: 50% 25%;
        }
        50% {
          background-position: 75% 50%;
        }
    75% {
          background-position: 50% 0%;
        }
`;

export const BoardWrapper = styled(Grid)`
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const BoardContents = styled(BoardWrapper)`
  flex-direction: column;
  gap: 1px;
`;
export const BoardRow = styled(BoardWrapper)`
  gap: 1px;

  &:nth-child(1),
  &:nth-child(2) {
    & > .MuiGrid-root.MuiGrid-item {
      &:nth-child(2) {
        & > .MuiGrid-root {
        }
      }
    }
  }

  & > .MuiGrid-root.MuiGrid-item {
    &:nth-child(1),
    &:nth-child(2) {
    }
  }
`;
export const BoardCellWrapper = styled(Grid).attrs({
  className: "board-cell",
})`
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 15em;
  height: 15em;
  @media (max-width: 1024px) {
    width: 10em;
    height: 10em;
  }
  @media (max-width: 700px) {
    width: 8em;
    height: 8em;
  }
  @media (max-width: 600px) {
    width: 5em;
    height: 5em;
  }

  background-color: rgba(0, 0, 0, 0.8);

  &.signed {
    .board-cell-contents {
      transform: rotateY(180deg);
    }
  }

  &.disabled {
    cursor: not-allowed;
  }

  &.strike {
    .board-cell-contents > div {
      background: linear-gradient(300deg, rgba(151, 11, 45), darkviolet, blue);
      background-size: 180% 180%;
      animation: ${GradientAnimation} 5s ease infinite;

      svg {
        color: white;
      }
    }
  }
`;
export const BoardCellContents = styled(BoardWrapper).attrs({
  className: "board-cell-contents",
})`
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  border: 1px solid black;
  position: relative;
  transition: transform 0.8s;
  transform-style: preserve-3d;
`;

export const BoardCellFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
  background-color: white;
`;
export const BoardCellBack = styled(BoardCellFront)`
  transform: rotateY(180deg);

  svg {
    width: 100%;
    height: 100%;

    &.green {
      color: rgba(0, 100, 0, 0.9);
    }

    &.blue {
      color: rgba(0, 0, 100, 0.9);
    }
  }
`;
