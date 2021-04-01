import { storiesOf } from "@storybook/react";
import CreateNewLeagueForm from "./CreateNewLeagueForm";

storiesOf("Create New League Form", module).add("No props", () => {
  return <CreateNewLeagueForm />;
});

