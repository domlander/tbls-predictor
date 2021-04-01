import React, { FC } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";
import styled from "styled-components";
import colours from "@/styles/colours";

const Header: FC = () => {
  const [session, loading] = useSession();

  console.log(`Signed in as ${session?.user.email}`);

  return (
    <Container>
      <HeaderItem>
        <Link href="/">
          <A>Home</A>
        </Link>
      </HeaderItem>
      <HeaderItem>
        <Link href="/account">
          <A>Account</A>
        </Link>
      </HeaderItem>
      <HeaderItem>
        <Link href="/leagues">
          <A>Leagues</A>
        </Link>
      </HeaderItem>
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
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: ${colours.grey200};
  min-height: 3em;
`;

const HeaderItem = styled.div``;

const A = styled.a`
  text-decoration: none;
`;

export default Header;
