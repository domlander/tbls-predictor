import React from "react";
import { Story, Meta } from "@storybook/react";
import LeagueTable, { Props } from "./LeagueTable";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Organisms/LeagueTable ",
  component: LeagueTable,
} as Meta;

const Template: Story<Props> = (args) => <LeagueTable {...args} />;

export const fiveUsers = Template.bind({});
fiveUsers.args = {
  users: [
    {
      userId: 1,
      username: "Dom Lander",
      totalPoints: 158,
    },
    {
      userId: 2,
      username: "Simon Tester",
      totalPoints: 152,
    },
    {
      userId: 42,
      username: "Tom Spink",
      totalPoints: 151,
    },
    {
      userId: 210,
      username: "George Davies",
      totalPoints: 139,
    },
    {
      userId: 412,
      username: "Rob Burnham",
      totalPoints: 133,
    },
  ],
};
