import React from "react";
import { Story, Meta } from "@storybook/react";
import Heading, { Props } from "./Heading";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Heading",
  component: Heading,
} as Meta;

const Template: Story<Props> = (args) => <Heading {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  level: "h1",
  children: "Biggest Heading",
};

export const Secondary = Template.bind({});
Secondary.args = {
  level: "h2",
  children: "Big Heading",
};

export const Smallest = Template.bind({});
Smallest.args = {
  level: "p",
  children: "Tiny Heading",
};
