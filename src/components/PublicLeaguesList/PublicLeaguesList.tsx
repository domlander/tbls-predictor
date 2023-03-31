import Link from "next/link";
import styled from "styled-components";

import League from "src/types/League";
import colours from "src/styles/colours";
import Heading from "src/components/Heading";

export interface Props {
  leagues: League[];
}

const PublicLeaguesList = ({ leagues }: Props) => {
  if (!leagues?.length) return null;

  return (
    <Container>
      <Heading level="h2" variant="secondary">
        Public leagues
      </Heading>
      <ul>
        {leagues.map((league) => (
          <li key={league.id}>
            <Link href={`league/${league.id}`}>{league.name}</Link>
          </li>
        ))}
      </ul>
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2em;

  ul {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding-left: 0.2em;
    font-size: 1rem;
    gap: 1em;
  }

  li {
    text-decoration: underline;
    text-underline-offset: 2px;
    width: fit-content;

    :hover,
    :focus {
      color: ${colours.cyan100};
      text-decoration: none;
    }
  }
`;

export default PublicLeaguesList;
