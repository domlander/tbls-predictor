"use client";

import { useEffect, useState } from "react";
import userStats from "src/actions/userStats";
import styles from "./UserStats.module.css";
import Heading from "../Heading";

const UserStats = () => {
  const [perfectPerc, setPerfectPerc] = useState<number | null>(null);
  const [correctPerc, setCorrectPerc] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      return userStats();
    };

    fetchData().then((data) => {
      if (data !== null) {
        setPerfectPerc(data.perfectPerc);
        setCorrectPerc(data.correctPerc);
      }
    });
  }, []);

  if (perfectPerc === null || correctPerc === null) return null;

  return (
    <article className={styles.container}>
      <Heading level="h2" as="h1" variant="secondary">
        My stats
      </Heading>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div>Perfect %</div>
          <div className={styles.statPerc}>{perfectPerc.toFixed(1)}</div>
        </div>
        <div className={styles.stat}>
          <div>Correct %</div>
          <div className={styles.statPerc}>{correctPerc.toFixed(1)}</div>
        </div>
      </div>
    </article>
  );
};

export default UserStats;
