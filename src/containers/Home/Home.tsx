import React from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import HeaderBar from "@/components/molecules/HeaderBar";
import Heading from "@/components/atoms/Heading";

export default function Home() {
  const [session, loading] = useSession();

  console.log(`Signed in as ${session?.user.email}`);

  return (
    <>
      <HeaderBar initial="D" />
      <Heading level="h1">Home</Heading>
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
