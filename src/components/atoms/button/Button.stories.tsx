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

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  backgroundColour: colours.grey200,
  borderRadius: 3,
  children: "Submit",
  colour: colours.blackblue400,
  height: 48,
  width: 134,
};

export const Secondary = Template.bind({});
Secondary.args = {
  backgroundColour: colours.blue100,
  borderRadius: 3,
  children: "Save",
  colour: colours.blackblue500,
  height: 48,
  width: 343,
};
