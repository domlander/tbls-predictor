import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import { USER_QUERY } from "apollo/queries";
import { UPDATE_USERNAME_MUTATION } from "apollo/mutations";
import Heading from "src/components/Heading";
import ChangeUsernameForm from "src/components/ChangeUsernameForm";

const AccountContainer = () => {
  const [currentUsername, setCurrentUsername] = useState();
  const [formUsername, setFormUsername] = useState("");
  const [userFeedback, setUserFeedback] = useState("");
  const [processRequest] = useMutation(UPDATE_USERNAME_MUTATION);

  const { loading, error } = useQuery(USER_QUERY, {
    onCompleted: ({ user }) => {
      setCurrentUsername(user.username);
      setFormUsername(user.username);
    },
  });

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
      {/* TODO: Better loading and error views */}
      {error ? (
        <div>An error has occurred. Please try again later.</div>
      ) : loading ? (
        <p>Loading...</p>
      ) : (
        <ChangeUsernameForm
          username={formUsername}
          setUsername={setFormUsername}
          isFormDisabled={currentUsername === formUsername}
          userFeedback={userFeedback}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default AccountContainer;
