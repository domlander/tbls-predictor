"use server";

import prisma from "prisma/client";
import Fixture from "src/types/Fixture";
import sortFixtures from "utils/sortFixtures";

const fetchGameweekFixtures = async (gameweek: number): Promise<Fixture[]> => {
  if (gameweek < 1 || gameweek > 38) {
    return [];
  }

  const fixtures = await prisma.fixture.findMany({
    where: {
      gameweek,
    },
  });

  return sortFixtures(fixtures);
};

export default fetchGameweekFixtures;
