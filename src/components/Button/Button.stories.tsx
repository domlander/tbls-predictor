import React from "react";
import { Story, Meta } from "@storybook/react";
import Button, { Props } from "./Button";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Button",
  component: Button,
  argTypes: {
    disabled: { control: { type: "boolean" } },
    handleClick: { action: "clicked" },
  },
} as Meta;

const Template: Story<Props> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  variant: "primary",
  children: "Submit",
  disabled: false,
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: "secondary",
  children: "Save",
  disabled: false,
};
