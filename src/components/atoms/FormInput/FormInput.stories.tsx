import React from "react";
import { Story, Meta } from "@storybook/react";
import FormInput from "./FormInput";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Atoms/FormInput",
  component: FormInput,
} as Meta;

const Template: Story = (args) => <FormInput {...args} />;

export const WithPlaceholder = Template.bind({});
WithPlaceholder.args = {
  placeholder: "Email",
};

export const WithValue = Template.bind({});
WithValue.args = {
  value: "domtest722@mailinator.com",
  width: "15em",
};
