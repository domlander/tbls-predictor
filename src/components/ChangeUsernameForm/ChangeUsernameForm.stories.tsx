import React from "react";
import { Story, Meta } from "@storybook/react";
import ChangeUsernameForm, { Props } from "./ChangeUsernameForm";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Organisms/ChangeUsernameForm",
  component: ChangeUsernameForm,
} as Meta;

const Template: Story<Props> = (args) => <ChangeUsernameForm {...args} />;

export const primary = Template.bind({});
primary.args = {
  username: "Dom Lander",
  setUsername: () => {},
  isFormDisabled: false,
  handleSubmit: () => {},
};
