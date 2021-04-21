import React from "react";
import { Story, Meta } from "@storybook/react";
import styled from "styled-components";
import GridRow from "./GridRow";
import { correctChip, perfectChip } from "../../atoms/Chip";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Molecules/GridRow",
  component: GridRow,
} as Meta;

/*
 * We're gonna be using the GridRow in a css grid, so we need to simulate that
 * to more accurately see in storybook how it'll look to the user
 */
const Container = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr 30px 30px 1fr;
`;

const Template: Story = (args) => (
  <Container>
    <GridRow {...args} />
  </Container>
);

export const PreDeadline = Template.bind({});
PreDeadline.args = {
  datetime: "Fri 19:30",
  homeTeam: "Manchester United",
  awayTeam: "West Ham United",
  locked: false,
};

export const WithPredictions = Template.bind({});
WithPredictions.args = {
  datetime: "Fri 19:30",
  homeTeam: "Manchester United",
  homeScore: 2,
  awayTeam: "West Ham United",
  awayScore: 0,
  locked: false,
};

export const NoChip = Template.bind({});
NoChip.args = {
  datetime: "Fri 19:30",
  homeTeam: "Manchester United",
  homeScore: 2,
  awayTeam: "West Ham United",
  awayScore: 0,
  locked: true,
};

export const Perfect = Template.bind({});
Perfect.args = {
  datetime: "Fri 19:30",
  homeTeam: "Manchester United",
  homeScore: 2,
  awayTeam: "West Ham United",
  awayScore: 0,
  chip: perfectChip,
  locked: true,
};

export const Correct = Template.bind({});
Correct.args = {
  datetime: "Fri 19:30",
  homeTeam: "Manchester United",
  homeScore: 2,
  awayTeam: "West Ham United",
  awayScore: 0,
  chip: correctChip,
  locked: true,
};
