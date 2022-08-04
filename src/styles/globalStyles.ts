import { createGlobalStyle } from "styled-components";
import colours from "./colours";
import pageSizes from "./pageSizes";

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Work Sans', sans-serif;
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
    font-weight: 400;
    margin: 0;
  }

  h1 {
    font-size: 2.5rem;
    margin: 1em 0;
  }

  h2 {
    font-weight: 300;
    letter-spacing: -1px;
    font-size: 2.2rem;
    @media (max-width: ${pageSizes.mobileL}) {
      font-size: 1.6rem;
    }
  }

  h3 { 
    font-size: 1.8rem;
  }

  a {
    text-decoration: inherit;
    color: inherit;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    list-style: none;
  }
`;

export default GlobalStyle;
