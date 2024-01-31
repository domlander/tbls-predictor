"use client";

import { Dispatch, SetStateAction } from "react";
import Button from "src/components/Button";

const ShowTeamFormButton = ({
  displayForm,
  setDisplayForm,
}: {
  displayForm: boolean;
  setDisplayForm: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Button
      variant="secondary"
      handleClick={() => setDisplayForm(!displayForm)}
      size="small"
    >
      {displayForm ? "Hide team form" : "Show team form"}
    </Button>
  );
};

export default ShowTeamFormButton;
