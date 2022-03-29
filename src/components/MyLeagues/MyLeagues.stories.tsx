import React from "react";
import { Story, Meta } from "@storybook/react";
import MyLeagues, { Props } from "./MyLeagues";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "MyLeagues",
  component: MyLeagues,
} as Meta;

const Template: Story<Props> = (args) => <MyLeagues {...args} />;

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
