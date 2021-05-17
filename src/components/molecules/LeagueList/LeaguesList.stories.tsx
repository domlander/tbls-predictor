import React from "react";
import { Story, Meta } from "@storybook/react";
import LeaguesList, { Props } from "./LeaguesList";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Molecules/LeaguesList ",
  component: LeaguesList,
} as Meta;

const Template: Story<Props> = (args) => <LeaguesList {...args} />;

export const primary = Template.bind({});
primary.args = {
  leagues: [
    {
      id: 1,
      name: "League of Eli",
    },
    {
      id: 2,
      name: "Eredifishy",
    },
  ],
};
