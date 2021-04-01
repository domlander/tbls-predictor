import React, { FC } from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from 'next/image'

interface Props {
  prevGwUrl: string
  nextGwUrl: string
  gameweek: number
}

const PredictionTable: FC<Props> = ({ gameweek, prevGwUrl, nextGwUrl }) => (
  <Container>
    {
      gameweek > 1
        ? <Link href={prevGwUrl}>
          <a>
            <Image src="/images/ArrowLeft.svg" alt="left arrow" width="30" height="44" />
          </a>
        </Link>
        : <Image src="/images/ArrowLeftDisabled.svg" alt="left arrow disabled" width="30" height="44" />
    }
    <Title>Week {gameweek}</Title>
    {
      // TODO: The conditional should check whether weekId is <= to total number of gameweeks
      gameweek <= 17
        ? <Link href={nextGwUrl}>
          <a>
            <Image src="/images/ArrowRight.svg" alt="left arrow" width="30" height="44" />
          </a>
        </Link>
        : <Image src="/images/ArrowRightDisabled.svg" alt="left arrow disabled" width="30" height="44" />
    }
  </Container>
)

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 1rem 0;
`

const Title = styled.h1`
  text-align: center;
`

export default PredictionTable;