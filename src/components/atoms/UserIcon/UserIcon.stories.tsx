import React from "react";
import { Story, Meta } from "@storybook/react";
import UserIcon, { Props } from "./UserIcon";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Atoms/UserIcon",
  component: UserIcon,
} as Meta;

const Template: Story<Props> = (args) => <UserIcon {...args} />;

export const Clickable = Template.bind({});
Clickable.args = {
  initial: "D",
};
Clickable.argTypes = {
  handleClick: { action: "clicked" },
};

export const NotClickable = Template.bind({});
NotClickable.args = {
  initial: "D",
};
