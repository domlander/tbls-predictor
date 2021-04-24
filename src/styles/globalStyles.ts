import { createGlobalStyle } from "styled-components";
import colours from "./colours";

const GlobalStyle = createGlobalStyle`
  * {
    font-family: Nunito Sans, sans-serif;
  }

  body {
    margin: 0;
    padding: 0;
    font-size: 10px;
    color: ${colours.grey100};
    min-height: 100vh;
    background-color: ${colours.blackblue400};
  }

  table {
    border-collapse: collapse;
  }

  button {
    padding: 0;
    border: none;
    outline: none;
    font: inherit;
    color: inherit;
    background: none
  }

  h1, h2, h3, h4 ,h5, h6 {
    font-family: Nunito, sans-serif;
    font-weight: 400;
  }

  h1 {
    font-size: 40px;
    margin: 0.8em 0;
  }

  h2 { font-size: 32px; }
  h3 { font-size: 24px; }
`;

export default GlobalStyle;
