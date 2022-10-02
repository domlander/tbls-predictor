import React, { useState } from "react";
import styled from "styled-components";
import { Story, Meta } from "@storybook/react";
import colours from "src/styles/colours";
import GridRowFixture from "./GridRowFixture";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "GridRow",
  component: GridRowFixture,
  decorators: [
    (Story) => {
      const [homeGoals, setHomeGoals] = useState("2");
      const [awayGoals, setAwayGoals] = useState("1");
      const updateGoals = (_: number, isHome: boolean, value: string) =>
        isHome ? setHomeGoals(value) : setAwayGoals(value);

      return (
        <Container>
          <Story
            homeGoals={homeGoals}
            awayGoals={awayGoals}
            updateGoals={updateGoals}
          />
        </Container>
      );
    },
  ],
} as Meta;

const Container = styled.div`
  display: grid;
  grid-template-columns: 7em 1fr auto auto 1fr;
  background: ${colours.grey200};
  outline: 0.1em solid ${colours.grey200};
`;

const sharedArgs = {
  fixtureId: 1,
  kickoff: "Fri 19:30",
  homeTeam: "Manchester United",
  awayTeam: "West Ham United",
  updateGoals: () => {},
};

const Template: Story = (args) => <GridRowFixture {...args} {...sharedArgs} />;

export const PreDeadline = Template.bind({});
PreDeadline.args = {
  locked: false,
  predictionScore: 0,
};

export const NoChip = Template.bind({});
NoChip.args = {
  homeGoals: 1,
  awayGoals: 1,
  locked: true,
  predictionScore: 0,
};

export const Perfect = Template.bind({});
Perfect.args = {
  homeGoals: 3,
  awayGoals: 1,
  locked: true,
  predictionScore: 3,
};

export const Correct = Template.bind({});
Correct.args = {
  homeGoals: 2,
  awayGoals: 1,
  locked: true,
  predictionScore: 1,
};
