import React from "react";
import { Story, Meta } from "@storybook/react";
import LeagueWeekFixtures, { Props } from "./LeagueWeekFixtures";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "LeagueWeekFixtures",
  component: LeagueWeekFixtures,
} as Meta;

const Template: Story<Props> = (args) => <LeagueWeekFixtures {...args} />;

export const primary = Template.bind({});
primary.args = {
  weekId: 1,
  fixtures: [
    {
      id: 1,
      gameweek: 1,
      homeTeam: "Chelsea",
      awayTeam: "West Brom",
      homeGoals: 2,
      awayGoals: 5,
      kickoff: new Date("2021-04-03T12:30:00.000Z"),
      predictions: [
        [3, 1],
        [0, 1],
      ],
    },
    {
      id: 2,
      gameweek: 1,
      homeTeam: "Man City",
      awayTeam: "Leicester",
      homeGoals: 2,
      awayGoals: 0,
      kickoff: new Date("2021-04-03T15:00:00.000Z"),
      predictions: [
        [2, 1],
        [2, 0],
      ],
    },
  ],
};
