import Link from "next/link";
import Image from "next/image";

import arrowLeft from "public/images/ArrowLeft.svg";
import arrowRight from "public/images/ArrowRight.svg";
import arrowLeftDisabled from "public/images/ArrowLeftDisabled.svg";
import arrowRightDisabled from "public/images/ArrowRightDisabled.svg";

import Heading from "src/components/Heading";
import styles from "./WeekNavigator.module.css";

export type Props = {
  prevGameweekUrl?: string;
  nextGameweekUrl?: string;
  week: number;
};

const WeekNavigator = ({ prevGameweekUrl, nextGameweekUrl, week }: Props) => (
  <div className={styles.container}>
    {prevGameweekUrl ? (
      <Link href={prevGameweekUrl}>
        <Image src={arrowLeft} alt="Go to previous week" priority />
      </Link>
    ) : (
      <Image src={arrowLeftDisabled} alt="disabled navigation" priority />
    )}
    <Heading level="h1" variant="secondary">
      Gameweek {week}
    </Heading>
    {nextGameweekUrl ? (
      <Link href={nextGameweekUrl}>
        <Image src={arrowRight} alt="Go to next week" />
      </Link>
    ) : (
      <Image src={arrowRightDisabled} alt="disabled navigation" />
    )}
  </div>
);

export default WeekNavigator;
