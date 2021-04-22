import React from "react";
import { Story, Meta } from "@storybook/react";
import HeaderBar, { Props } from "./HeaderBar";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Molecules/HeaderBar",
  component: HeaderBar,
  argTypes: { handleClick: { action: "clicked" } },
} as Meta;

const Template: Story<Props> = (args) => <HeaderBar {...args} />;

export const Default = Template.bind({});
Default.args = {
  initial: "D",
};
