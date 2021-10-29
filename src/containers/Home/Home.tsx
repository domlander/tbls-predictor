import React from "react";
import Head from "next/head";
import Heading from "@/components/atoms/Heading";

export default function Home() {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Predict Premier League football scores. Challenge you friends to a score prediction battle with live updates and league tables."
        />
        <meta
          property="og:description"
          content="Predict Premier League results, create leagues with friends and keep track of your score."
        />
      </Head>
      <Heading level="h1">Home</Heading>
    </>
  );
}
