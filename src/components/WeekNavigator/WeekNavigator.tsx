import React from "react";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";

import pageSizes from "src/styles/pageSizes";
import Heading from "src/components/Heading";

export type Props = {
  prevGameweekUrl?: string;
  nextGameweekUrl?: string;
  week: number;
};

const image = (src: string, alt: string) => (
  <Image src={src} alt={alt} width="30" height="44" />
);

const WeekNavigator = ({ prevGameweekUrl, nextGameweekUrl, week }: Props) => (
  <Container>
    {prevGameweekUrl ? (
      <Link href={prevGameweekUrl}>
        <a>{image("/images/ArrowLeft.svg", "Go to previous week")}</a>
      </Link>
    ) : (
      image("/images/ArrowLeftDisabled.svg", "disabled navigation")
    )}
    <WeekHeading level="h1" variant="secondary">
      Week {week}
    </WeekHeading>
    {nextGameweekUrl ? (
      <Link href={nextGameweekUrl}>
        <a>{image("/images/ArrowRight.svg", "Go to next week")}</a>
      </Link>
    ) : (
      image("/images/ArrowRightDisabled.svg", "disabled navigation")
    )}
  </Container>
);

const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const WeekHeading = styled(Heading)`
  font-size: 4.8em;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 3.6em;
  }
`;

export default WeekNavigator;
