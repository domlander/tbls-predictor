import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";

import { UPDATE_USERNAME_MUTATION } from "apollo/mutations";
import Heading from "src/components/Heading";
import ChangeUsernameForm from "src/components/ChangeUsernameForm";

type Props = {
  username: string;
};

const AccountContainer = ({ username }: Props) => {
  const [currentUsername, setCurrentUsername] = useState(username);
  const [formUsername, setFormUsername] = useState(username);
  const [userFeedback, setUserFeedback] = useState("");
  const [processRequest] = useMutation(UPDATE_USERNAME_MUTATION);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formUsername.length < 3)
      setUserFeedback("Username must be at least 3 characters");
    else
      processRequest({
        variables: {
          username: formUsername,
        },
      }).then(({ data: { updateUsername } }) => {
        setUserFeedback(
          `Success! Username changed to ${updateUsername.username}`
        );
        setCurrentUsername(updateUsername.username);
      });
  };

  return (
    <>
      <Heading level="h1" variant="secondary">
        Account
      </Heading>
      <ChangeUsernameForm
        username={formUsername}
        setUsername={setFormUsername}
        isFormDisabled={currentUsername === formUsername}
        userFeedback={userFeedback}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default AccountContainer;
