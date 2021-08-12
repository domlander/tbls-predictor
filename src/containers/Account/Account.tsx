import React, { FormEvent, useState } from "react";
import styled from "styled-components";
import { useMutation, useQuery } from "@apollo/client";

import { USER } from "apollo/queries";
import { UPDATE_USERNAME } from "apollo/mutations";
import Heading from "@/components/atoms/Heading";
import Loading from "@/components/atoms/Loading";
import ChangeUsernameForm from "@/components/ChangeUsernameForm";

const AccountContainer = () => {
  const [currentUsername, setCurrentUsername] = useState();
  const [userId, setUserId] = useState();
  const [formUsername, setFormUsername] = useState("");
  const [userFeedback, setUserFeedback] = useState("");
  const [processRequest] = useMutation(UPDATE_USERNAME);

  const { loading, error } = useQuery(USER, {
    onCompleted: ({ user }) => {
      setUserId(user.id);
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
          input: { userId, username: formUsername },
        },
      }).then(({ data }) => {
        setUserFeedback(`Success! Username changed to ${data.updateUsername}`);
        setCurrentUsername(data.updateUsername);
      });
  };

  if (loading) return <Loading />;
  if (error) return <div>An error has occurred. Please try again later.</div>;

  return (
    <Container>
      <Heading level="h1">Account</Heading>
      <ChangeUsernameForm
        username={formUsername}
        setUsername={setFormUsername}
        isFormDisabled={currentUsername === formUsername}
        userFeedback={userFeedback}
        handleSubmit={handleSubmit}
      />
    </Container>
  );
};

const Container = styled.div`
  max-width: 560px;
  margin: 0 auto;
`;

export default AccountContainer;
