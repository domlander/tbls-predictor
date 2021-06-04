import { createGlobalStyle } from "styled-components";
import colours from "./colours";

const GlobalStyle = createGlobalStyle`
  * {
    font-family: Nunito Sans, sans-serif;
  }

  html {
    --background: ${colours.blackblue500};
    --header-background: ${colours.blackblue400};
  }

  body {
    margin: 0;
    padding: 0;
    font-size: 10px;
    color: ${colours.grey100};
    min-height: 100vh;
    background-color: var(--background);
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
    font-size: 4.8em;
    margin: 1em 0;
  }

  h2 { font-size: 3.8em; }
  h3 { font-size: 3.0em; }
  h4 { font-size: 2.4em; }
  h5 { font-size: 2.0em; }

  a {
    text-decoration: inherit;
    color: inherit;
  }
`;

export default GlobalStyle;
