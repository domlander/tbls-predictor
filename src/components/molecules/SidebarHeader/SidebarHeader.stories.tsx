import React from "react";
import { Story, Meta } from "@storybook/react";
import SidebarHeader, { Props } from "./SidebarHeader";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Molecules/SidebarHeader",
  component: SidebarHeader,
  argTypes: { handleClick: { action: "clicked" } },
} as Meta;

const Template: Story<Props> = (args) => <SidebarHeader {...args} />;

export const Default = Template.bind({});
Default.args = {
  username: "DomTest722",
};
