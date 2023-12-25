import styled, { keyframes } from "styled-components";
import { Box, Grid } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

const ArrowBounce = keyframes`
    0% { transform: translateX(-5px)  }
    50% { transform: translateX(10px) }
    100% { transform: translateX(-5px) }
`;

export const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1em;

  hr {
    width: 100%;
  }

  button {
    justify-self: end;
  }
`;

export const Header = styled(Grid)`
  &.MuiGrid-root {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
`;

export const Contents = styled(Header)`
  h3 {
    margin-bottom: 0.5em;
  }
  &.MuiGrid-root {
    gap: 5px;
  }
`;

export const PlayerRow = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 1em;
  border: ${({ active }) => (active ? 1 : 0)}px solid black;
  padding: 5px 7px;
  border-radius: 5px;
`;

export const PlayerTitle = styled.span<{ active: boolean }>`
  font-size: larger;
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
`;

export const ActivePlayerArrow = styled(ArrowBackOutlinedIcon)`
  &.MuiSvgIcon-root {
    color: red;
    animation: ${ArrowBounce} 1s ease infinite;

    @media (max-width: 700px) {
      display: none;
    }
  }
`;
