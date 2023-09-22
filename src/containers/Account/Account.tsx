import { FormEvent, useState } from "react";

import Heading from "src/components/Heading";
import ChangeUsernameForm from "src/components/ChangeUsernameForm";

type Props = {
  initialUsername: string;
};

const AccountContainer = ({ initialUsername }: Props) => {
  const [currentUsername, setCurrentUsername] = useState(initialUsername);
  const [username, setFormUsername] = useState(initialUsername);
  const [userFeedback, setUserFeedback] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (username.length < 3) {
      setUserFeedback("Username must be at least 3 characters");
      return;
    }

    const formData = new URLSearchParams();
    formData.append("username", username);

    fetch("/api/updateUsername", {
      method: "POST",
      body: formData,
    }).then(async (result) => {
      const data = await result.json();
      setCurrentUsername(data.username);
      setUserFeedback(`Success! Username changed to ${data.username}`);
    });
  };

  return (
    <>
      <Heading level="h1" variant="secondary">
        Account
      </Heading>
      <ChangeUsernameForm
        username={username}
        setUsername={setFormUsername}
        isDisabled={currentUsername === username}
        userFeedback={userFeedback}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default AccountContainer;
