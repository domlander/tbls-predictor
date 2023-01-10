import React from "react";
import { Story, Meta } from "@storybook/react";
import LeagueWeekUserTotals, { Props } from "./LeagueWeekUserTotals";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "LeagueWeekUserTotals",
  component: LeagueWeekUserTotals,
} as Meta;

// eslint-disable-next-line react/jsx-props-no-spreading
const Template: Story<Props> = (args) => <LeagueWeekUserTotals {...args} />;

export const twoUsers = Template.bind({});
twoUsers.args = {
  users: [
    {
      userId: "1",
      username: "DomTest1",
      points: 2,
    },
    {
      userId: "2",
      username: "DomTest2",
      points: 5,
    },
  ],
};

export const fiveUsers = Template.bind({});
fiveUsers.args = {
  users: [
    {
      userId: "1",
      username: "DomTest1",
      points: 12,
    },
    {
      userId: "2",
      username: "DomTest2",
      points: 8,
    },
    {
      userId: "3",
      username: "DomTest3",
      points: 8,
    },
    {
      userId: "4",
      username: "DomTest4",
      points: 5,
    },
    {
      userId: "5",
      username: "DomTest5",
      points: 11,
    },
  ],
};
