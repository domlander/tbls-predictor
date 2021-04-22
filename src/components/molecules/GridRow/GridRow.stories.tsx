import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import styled from "styled-components";
import GridRow from "./GridRow";
import { correctChip, perfectChip } from "../../atoms/Chip";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Molecules/GridRow",
  component: GridRow,
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
  grid-template-columns: 72px 1fr 30px 30px 1fr;
`;

const sharedArgs = {
  fixtureId: 1,
  kickoff: "Fri 19:30",
  homeTeam: "Manchester United",
  awayTeam: "West Ham United",
  updateGoals: () => {},
};

const Template: Story = (args) => <GridRow {...args} {...sharedArgs} />;

export const PreDeadline = Template.bind({});
PreDeadline.args = {
  locked: false,
};

export const NoChip = Template.bind({});
NoChip.args = {
  locked: true,
};

export const Perfect = Template.bind({});
Perfect.args = {
  chip: perfectChip,
  locked: true,
};

export const Correct = Template.bind({});
Correct.args = {
  chip: correctChip,
  locked: true,
};
