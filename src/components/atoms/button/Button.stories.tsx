import React from "react";
import { Story, Meta } from "@storybook/react";
import colours from "../../../styles/colours";
import Button, { Props } from "./Button";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Atoms/Button",
  component: Button,
  argTypes: { handleClick: { action: "clicked" } },
} as Meta;

const Template: Story<Props> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  backgroundColour: colours.grey200,
  hoverColour: colours.grey300,
  label: "Submit",
  colour: colours.blackblue400,
  width: 5.6,
};

export const Secondary = Template.bind({});
Secondary.args = {
  backgroundColour: colours.blue100,
  hoverColour: colours.blue200,
  label: "Save",
  colour: colours.blackblue500,
  width: 14.3,
};
