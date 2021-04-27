import React from "react";
import { Story, Meta } from "@storybook/react";
import WeekNavigator, { Props } from "./WeekNavigator";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Molecules/WeekNavigator",
  component: WeekNavigator,
} as Meta;

const Template: Story<Props> = (args) => <WeekNavigator {...args} />;

export const FirstGameweek = Template.bind({});
FirstGameweek.args = {
  week: 1,
  nextGameweekUrl: "/leagues",
};

export const MiddleGameweek = Template.bind({});
MiddleGameweek.args = {
  week: 11,
  prevGameweekUrl: "/leagues",
  nextGameweekUrl: "/leagues",
};

export const FinalGameweek = Template.bind({});
FinalGameweek.args = {
  week: 17,
  prevGameweekUrl: "/leagues",
};
