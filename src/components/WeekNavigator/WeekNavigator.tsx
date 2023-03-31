import Link from "next/link";
import Image from "next/image";
import arrowLeft from "public/images/ArrowLeft.svg";
import arrowRight from "public/images/ArrowRight.svg";
import arrowLeftDisabled from "public/images/ArrowLeftDisabled.svg";
import arrowRightDisabled from "public/images/ArrowRightDisabled.svg";
import styled from "styled-components";
import Heading from "src/components/Heading";

export type Props = {
  prevGameweekUrl?: string;
  nextGameweekUrl?: string;
  week: number;
};

const WeekNavigator = ({ prevGameweekUrl, nextGameweekUrl, week }: Props) => (
  <Container>
    {prevGameweekUrl ? (
      <Link href={prevGameweekUrl}>
        <Image src={arrowLeft} alt="Go to previous week" />
      </Link>
    ) : (
      <Image src={arrowLeftDisabled} alt="disabled navigation" />
    )}
    <Heading level="h1" variant="secondary">
      Week {week}
    </Heading>
    {nextGameweekUrl ? (
      <Link href={nextGameweekUrl}>
        <Image src={arrowRight} alt="Go to next week" />
      </Link>
    ) : (
      <Image src={arrowRightDisabled} alt="disabled navigation" />
    )}
  </Container>
);

const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export default WeekNavigator;
