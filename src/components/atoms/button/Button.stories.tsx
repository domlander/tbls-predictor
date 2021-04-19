import React from "react";
import { Story, Meta } from "@storybook/react";

import Button, { ButtonProps } from "./Button";
import colours from "../../../styles/colours";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Atoms/Button",
  component: Button,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as Meta;

const Template: Story<ButtonProps> = (args) => (
  <Button {...args}>My Button</Button>
);

export const Primary = Template.bind({});
Primary.args = {
  width: 134,
  height: 47,
  backgroundColour: colours.grey200,
  borderRadius: 3,
};
