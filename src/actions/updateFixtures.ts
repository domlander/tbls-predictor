"use server";

import * as Sentry from "@sentry/nextjs";
import prisma from "prisma/client";
import Fixture from "src/types/Fixture";

const updateFixturesDatabase = async (
  fixtures: Partial<Fixture>[]
): Promise<void> => {
  if (!fixtures?.length) return;

  const fixtureUpdates = fixtures.map(({ id, homeTeam, awayTeam }) => {
    // eslint-disable-next-line consistent-return
    return prisma.fixture.update({
      where: {
        id,
      },
      data: {
        homeTeam,
        awayTeam,
      },
    });
  });

  try {
    await Promise.all(fixtureUpdates);
  } catch (e) {
    Sentry.captureException(e);
  }
};

export default updateFixturesDatabase;
