import React from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";

interface Props {
  gameweek: number;
  prevGwUrl: string;
  nextGwUrl: string;
  maxGameweeks: number;
}

const GameweekNavigator = ({
  gameweek,
  prevGwUrl,
  nextGwUrl,
  maxGameweeks,
}: Props) => (
  <Container>
    {gameweek > 1 ? (
      <Link href={prevGwUrl}>
        <a>
          <Image
            src="/images/ArrowLeft.svg"
            alt="left arrow"
            width="30"
            height="44"
          />
        </a>
      </Link>
    ) : (
      <Image
        src="/images/ArrowLeftDisabled.svg"
        alt="left arrow disabled"
        width="30"
        height="44"
      />
    )}
    <Title>Week {gameweek}</Title>
    {
      // Render disable right arrow if we're in the final gameweek
      gameweek < maxGameweeks ? (
        <Link href={nextGwUrl}>
          <a>
            <Image
              src="/images/ArrowRight.svg"
              alt="left arrow"
              width="30"
              height="44"
            />
          </a>
        </Link>
      ) : (
        <Image
          src="/images/ArrowRightDisabled.svg"
          alt="left arrow disabled"
          width="30"
          height="44"
        />
      )
    }
  </Container>
);

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 1rem auto;
  max-width: 500px;
`;

const Title = styled.h1`
  text-align: center;
`;

export default GameweekNavigator;
