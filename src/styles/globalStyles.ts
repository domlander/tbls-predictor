import { createGlobalStyle } from 'styled-components';
import colours from './colours';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Hind Madurai, Sans-Serif;
    font-size: 12px;
    color: ${colours.black500};
  }

  table {
    border-collapse: collapse;
  }

  input {
    font-family: Hind Madurai, Sans-Serif;
  }

  h1 {
    font-size: 32px;
    font-weight: 500;
  }
`;

export default GlobalStyle;