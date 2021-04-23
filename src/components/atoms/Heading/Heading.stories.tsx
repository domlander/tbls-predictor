import React from "react";
import { Story, Meta } from "@storybook/react";
import Heading, { Props } from "./Heading";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Atoms/Heading",
  component: Heading,
} as Meta;

const Template: Story<Props> = (args) => <Heading {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  headingLevel: "h1",
  children: "Biggest Heading",
};

export const Secondary = Template.bind({});
Secondary.args = {
  headingLevel: "h2",
  children: "Big Heading",
};

export const Smallest = Template.bind({});
Smallest.args = {
  headingLevel: "p",
  children: "Tiny Heading",
};
