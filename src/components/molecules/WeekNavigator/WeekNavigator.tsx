import Image from "next/image";
import styled from "styled-components";
import React from "react";
import Link from "next/link";
import Heading from "../../atoms/Heading";

export type Props = {
  prevGameweekUrl?: string;
  nextGameweekUrl?: string;
  week: number;
};

const image = (src: string, alt: string) => (
  <Image src={src} alt={alt} width="30" height="44" />
);

const WeekNavigator = ({ prevGameweekUrl, nextGameweekUrl, week }: Props) => (
  <StyledWeekNavigator>
    {prevGameweekUrl ? (
      <Link href={prevGameweekUrl}>
        <a>{image("/images/ArrowLeft.svg", "Go to previous week")}</a>
      </Link>
    ) : (
      image("/images/ArrowLeftDisabled.svg", "disabled navigation")
    )}
    <Title headingLevel="h1">Week {week}</Title>
    {nextGameweekUrl ? (
      <Link href={nextGameweekUrl}>
        <a>{image("/images/ArrowRight.svg", "Go to next week")}</a>
      </Link>
    ) : (
      image("/images/ArrowRightDisabled.svg", "disabled navigation")
    )}
  </StyledWeekNavigator>
);

const StyledWeekNavigator = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 1rem auto;
  max-width: 500px;
`;

const Title = styled(Heading)`
  text-align: center;
`;

export default WeekNavigator;
