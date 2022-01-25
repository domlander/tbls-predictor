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
  userId: 254,
  username: "Jim Halpert",
  totalPoints: 12,
};

const userTwo = {
  userId: 701,
  username: "Dave Street",
  totalPoints: 5,
};

const userThree = {
  userId: 45,
  username: "Mr Blobby",
  totalPoints: 7,
};

const userFour = {
  userId: 1134,
  username: "Graham Downey",
  totalPoints: 11,
};

const userFive = {
  userId: 540,
  username: "Dr Watson",
  totalPoints: 14,
};

export const twoUsers = Template.bind({});
twoUsers.args = {
  users: [userOne, userTwo],
  pointsByWeek: [
    { week: 1, points: [1, 2] },
    { week: 2, points: [5, 2] },
    { week: 3, points: [6, 1] },
  ],
  leagueId: 1,
};

export const threeUsers = Template.bind({});
threeUsers.args = {
  users: [userOne, userTwo, userThree],
  pointsByWeek: [
    { week: 1, points: [1, 2, 3] },
    { week: 2, points: [5, 2, 4] },
    { week: 3, points: [6, 1, 0] },
  ],
  leagueId: 2,
};

export const fiveUsers = Template.bind({});
fiveUsers.args = {
  users: [userOne, userTwo, userThree, userFour, userFive],
  pointsByWeek: [
    { week: 1, points: [1, 2, 3, 4, 3] },
    { week: 2, points: [5, 2, 4, 2, 6] },
    { week: 3, points: [6, 1, 0, 5, 5] },
  ],
  leagueId: 2,
};
