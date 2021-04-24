import React, { FormEvent, useState } from "react";
import HeaderBar from "@/components/molecules/HeaderBar";
import Heading from "@/components/atoms/Heading";

interface Props {
  username: string;
}

const AccountContainer = ({ username: initialUsername }: Props) => {
  const [formUsername, setFormUsername] = useState("");
  const [username, setUsername] = useState(initialUsername);
  const [updateStatus, setUpdateStatus] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("/api/updateUsername", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: formUsername }),
    }).then(() => {
      setUpdateStatus(true);
      setUsername(formUsername);
    });
  };

  return (
    <div>
      <HeaderBar initial="D" />
      <Heading level="h1">Account</Heading>
      <p>Welcome {username}</p>
      <form onSubmit={handleSubmit}>
        <h4>Change username</h4>
        <label>
          Username:
          <input
            type="text"
            value={formUsername}
            onChange={(e) => setFormUsername(e.target.value)}
            maxLength={20}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
      {updateStatus && <div>Username updated!</div>}
    </div>
  );
};

export default AccountContainer;
