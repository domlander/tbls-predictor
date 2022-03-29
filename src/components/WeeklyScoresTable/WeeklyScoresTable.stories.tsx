import React from "react";
import { Story, Meta } from "@storybook/react";
import WeeklyScoresTable, { Props } from "./WeeklyScoresTable";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "WeeklyScoresTable",
  component: WeeklyScoresTable,
} as Meta;

const Template: Story<Props> = (args) => <WeeklyScoresTable {...args} />;

const userOne = {
  id: "254",
  username: "Jim Halpert",
  totalPoints: 12,
  weeklyPoints: [{ week: 1, points: 8 }],
};

const userTwo = {
  id: "701",
  username: "Dave Street",
  totalPoints: 5,
  weeklyPoints: [{ week: 1, points: 4 }],
};

const userThree = {
  id: "45",
  username: "Mr Blobby",
  totalPoints: 7,
  weeklyPoints: [{ week: 1, points: 5 }],
};

const userFour = {
  id: "1134",
  username: "Graham Downey",
  totalPoints: 11,
  weeklyPoints: [{ week: 1, points: 2 }],
};

const userFive = {
  id: "540",
  username: "Dr Watson",
  totalPoints: 14,
  weeklyPoints: [{ week: 1, points: 10 }],
};

export const twoUsers = Template.bind({});
twoUsers.args = {
  users: [userOne, userTwo],
  leagueId: 1,
};

export const threeUsers = Template.bind({});
threeUsers.args = {
  users: [userOne, userTwo, userThree],
  leagueId: 2,
};

export const fiveUsers = Template.bind({});
fiveUsers.args = {
  users: [userOne, userTwo, userThree, userFour, userFive],
  leagueId: 2,
};
