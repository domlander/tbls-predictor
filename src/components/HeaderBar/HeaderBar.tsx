import styled from "styled-components";

import pageSizes from "src/styles/pageSizes";
import UserIcon from "src/components/UserIcon";
import HeaderLink from "../HeaderLink";

export interface Props {
  initial: string;
  isLoading: boolean;
  handleClick?: () => void;
}

const HeaderBar = ({ initial, isLoading, handleClick }: Props) => (
  <Container>
    <nav>
      <ul>
        <HeaderLink text="Home" link="/" />
        <HeaderLink text="Predictions" link="/predictions" />
        <HeaderLink text="Leagues" link="/leagues" />
        <HeaderLink text="Table" link="/premierleague" />
      </ul>
    </nav>
    <div>
      {!isLoading ? (
        <UserIcon initial={initial} handleClick={handleClick} />
      ) : null}
    </div>
  </Container>
);

const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--header-background);
  height: 4rem;
  font-size: 0.9rem;
  padding-right: 1em;
  gap: 2em;

  @media (max-width: ${pageSizes.tablet}) {
    height: 3rem;
    font-size: 0.7rem;
  }

  nav {
    height: 100%;
    width: 100%;

    // Select all header items excluding the first three
    @media (max-width: ${pageSizes.tablet}) {
      li:nth-child(n + 4) {
        display: none;
      }
    }
  }

  ul {
    height: 100%;
    display: flex;
    gap: 4em;
    margin-left: 4em;
    width: fit-content;

    @media (max-width: ${pageSizes.mobileL}) {
      gap: 3em;
      margin-left: 3em;
    }
  }
`;

export default HeaderBar;
