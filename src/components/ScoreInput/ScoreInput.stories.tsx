import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import ScoreInput from "./ScoreInput";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "ScoreInput",
  component: ScoreInput,
  decorators: [
    (Story) => {
      const [goals, setgoals] = useState("");
      return <Story goals={goals} updateGoals={(g) => setgoals(g)} />;
    },
  ],
} as Meta;

const Template: Story = (args) => <ScoreInput {...args} />;

export const Editable = Template.bind({});
Editable.args = {
  isScoreEditable: true,
  fixtureId: 1,
  isHome: true,
};

export const EditableWithScore = Template.bind({});
EditableWithScore.args = {
  isScoreEditable: true,
  fixtureId: 1,
  isHome: true,
};

export const Uneditable = Template.bind({});
Uneditable.args = {
  isScoreEditable: false,
  fixtureId: 1,
  isHome: true,
};
