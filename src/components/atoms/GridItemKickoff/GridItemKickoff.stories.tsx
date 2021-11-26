import React from "react";
import { Story, Meta } from "@storybook/react";
import GridItemKickoff from "./GridItemKickoff";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Atoms/GridItemKickoff",
  component: GridItemKickoff,
} as Meta;

const Template: Story = (args) => <GridItemKickoff {...args} />;

export const Date = Template.bind({});
Date.args = {
  label: "Fri 19:30",
  locked: false,
};

// export const AwayTeam = Template.bind({});
// AwayTeam.args = {
//   label: "West Ham United",
//   alignText: "left",
//   locked: false,
// };

// export const HomeTeamWithChip = Template.bind({});
// HomeTeamWithChip.args = {
//   label: "Manchester United",
//   alignText: "right",
//   locked: false,
//   predictionScore: 3,
// };
