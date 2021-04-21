import { createGlobalStyle } from "styled-components";
import colours from "./colours";

const GlobalStyle = createGlobalStyle`
  * {
    font-family: Nunito Sans, sans-serif;
  }

  body {
    margin: 0;
    padding: 0;
    font-size: 12px;
    color: ${colours.black500};
  }

  table {
    border-collapse: collapse;
  }

  h1, h2, h3, h4 ,h5, h6 {
    font-family: Hind Madurai, sans-serif
  }

  h1 {
    font-size: 40px;
  }

  h2 {
    font-size: 32px;
  }

  h3 {
    font-size: 24px;
  }
`;

export default GlobalStyle;
