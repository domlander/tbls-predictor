import React from "react";
import { render, screen } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import "@testing-library/jest-dom/extend-expect";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import Home from "pages/index";
import { USER_LEAGUES_QUERY } from "apollo/queries";

const mocks: MockedResponse[] = [
  {
    request: {
      query: USER_LEAGUES_QUERY,
    },
    result: {
      data: {
        user: {
          leagues: [],
        },
      },
    },
  },
];

const sessionMock = {
  expires: "1",
  user: { id: "abc123", username: "Test User" },
};

describe("Home", () => {
  it("renders a heading", () => {
    render(
      <SessionProvider session={sessionMock}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Home weekId={1} fixtures={[]} recentFixturesByTeam={[]} />
        </MockedProvider>
      </SessionProvider>
    );

    expect(screen.getByRole("heading")).toHaveTextContent("Gameweek 1");
  });
});
