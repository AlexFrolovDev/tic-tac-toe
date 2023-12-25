import styled, { createGlobalStyle } from "styled-components";
import { Grid } from "@mui/material";

export const GlobalStyles = createGlobalStyle`
    html, body, #root {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }
`;

export const Wrapper = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const Main = styled(Grid)`
  display: flex;
  max-height: calc(50em);
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 1em;

  & > div:nth-child(1) {
    max-width: calc(15em * 3 + 1em);
    @media (max-width: 1024px) {
      max-width: calc(10em * 3 + 1em);
    }
    @media (max-width: 700px) {
      max-width: calc(8em * 3 + 1em);
    }
    @media (max-width: 600px) {
      max-width: calc(5em * 3 + 1em);
    }
  }
`;
export const Side = styled(Grid)`
  &.MuiGrid-root {
    display: flex;
    justify-content: stretch;
    align-items: stretch;
    box-sizing: border-box;
    padding: 1em;

    width: 15em;
    @media (max-width: 1024px) {
      width: 15em;
    }
    @media (max-width: 700px) {
      width: 15em;
    }
    border: 1px solid black;
    border-radius: 5px;
  }
`;
