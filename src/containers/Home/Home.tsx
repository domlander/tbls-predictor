import React from "react";
import styled from "styled-components";
import { signIn, signOut, useSession } from "next-auth/client";
import HeaderBar from "@/components/molecules/HeaderBar";

const Title = styled.h1`
  color: red;
  font-size: 50px;
`;

export default function Home() {
  const [session, loading] = useSession();

  console.log(`Signed in as ${session?.user.email}`);

  return (
    <>
      <HeaderBar initial="D" />
      <Title>Home</Title>
      {session ? (
        <div>
          <div>{session?.user.email}</div>
          <button type="button" onClick={signOut}>
            Sign out
          </button>
        </div>
      ) : (
        <div>
          Not signed in
          <button type="button" onClick={signIn}>
            Sign in
          </button>
        </div>
      )}
    </>
  );
}
