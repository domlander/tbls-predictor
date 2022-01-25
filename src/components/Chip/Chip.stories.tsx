import React from "react";
import { Story, Meta } from "@storybook/react";
import Chip, { Props } from "./Chip";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Chip",
  component: Chip,
} as Meta;

const Template: Story<Props> = (args) => <Chip {...args} />;

export const Perfect = Template.bind({});
Perfect.args = {
  variant: "perfect",
};

export const Correct = Template.bind({});
Correct.args = {
  variant: "correct",
};
