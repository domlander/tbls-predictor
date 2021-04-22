import React from "react";
import { Story, Meta } from "@storybook/react";
import UserIcon, { Props } from "./UserIcon";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Atoms/UserIcon",
  component: UserIcon,
  argTypes: { handleClick: { action: "clicked" } },
} as Meta;

const Template: Story<Props> = (args) => <UserIcon {...args} />;

export const Default = Template.bind({});
Default.args = {
  initial: "D",
};
