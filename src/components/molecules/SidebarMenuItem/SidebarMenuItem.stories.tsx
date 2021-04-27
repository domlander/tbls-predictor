import React from "react";
import { Story, Meta } from "@storybook/react";
import SidebarMenuItem, { Props } from "./SidebarMenuItem";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Molecules/SidebarMenuItem",
  component: SidebarMenuItem,
} as Meta;

const Template: Story<Props> = (args) => <SidebarMenuItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: "My leagues",
  url: "/leagues",
};
