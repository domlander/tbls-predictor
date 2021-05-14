import React from "react";
import { Story, Meta } from "@storybook/react";
import GridItem from "./GridItem";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Atoms/GridItem",
  component: GridItem,
} as Meta;

const Template: Story = (args) => <GridItem {...args} />;

export const Date = Template.bind({});
Date.args = {
  label: "Fri 19:30",
  alignText: "center",
  locked: false,
};

export const AwayTeam = Template.bind({});
AwayTeam.args = {
  label: "West Ham United",
  alignText: "left",
  locked: false,
};

export const HomeTeamWithChip = Template.bind({});
HomeTeamWithChip.args = {
  label: "Manchester United",
  alignText: "right",
  locked: false,
  predictionScore: 3,
};
