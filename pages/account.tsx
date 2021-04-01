import React, { FormEvent, useState } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import styled from "styled-components";
import prisma from "prisma/client";
import { generateDefaultUsername } from "@/utils";
import Header from "@/components/Header";

const Title = styled.h1`
  color: blue;
  font-size: 50px;
`;

interface Props {
  username: string;
}

const Account = ({ username: initialUsername }: Props) => {
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
      <Title>Account</Title>
      <Header />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the user's session based on the request
  const session = await getSession(context);

  // If no user, redirect to login
  if (!session) {
    return {
      props: {},
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email || "",
    },
  });

  // If error in user data, redirect to login.
  if (!user || user.email === null || user.email === "") {
    // TODO: Add some logging here. If this fails, something weird has happened
    return {
      props: {},
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const defaultUsername = generateDefaultUsername(user.email);

  // Give the user a default username if he doesn't have one
  if (user && !user.username) {
    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        username: defaultUsername,
      },
    });
  }

  return { props: { session, username: user.username || defaultUsername } };
};

export default Account;
