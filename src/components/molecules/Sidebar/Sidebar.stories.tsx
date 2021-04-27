import React from "react";
import { Story, Meta } from "@storybook/react";
import Sidebar, { Props } from "./Sidebar";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Molecules/Sidebar",
  component: Sidebar,
  argTypes: { handleClick: { action: "clicked" } },
} as Meta;

const Template: Story<Props> = (args) => <Sidebar {...args} />;

export const Default = Template.bind({});
Default.args = {
  username: "DomTest722",
};
