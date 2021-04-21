import React from "react";
import { Story, Meta } from "@storybook/react";

import colours from "../../../styles/colours";
import Button, { ButtonProps } from "./Button";

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
  label: "Submit",
  colour: colours.blackblue400,
  height: 48,
  width: 134,
};

export const Secondary = Template.bind({});
Secondary.args = {
  backgroundColour: colours.blue100,
  borderRadius: 3,
  label: "Save",
  colour: colours.blackblue500,
  height: 48,
  width: 343,
};
