import React from "react";
import Image from "next/image";
import { getSession, signIn } from "next-auth/client";
import styled from "styled-components";
import colours from "@/styles/colours";
import Heading from "@/components/atoms/Heading";
import Button from "@/components/atoms/Button";
import { GetServerSideProps } from "next";

const SignInPage = () => (
  <Container>
    <Heading level="h1">TBLS Predictor</Heading>
    <Image width={748} height={632} src="/images/kidsWithFootball.jpg" />
    <ButtonContainer>
      <Button
        handleClick={() => signIn()}
        type="button"
        colour={colours.blackblue400}
        backgroundColour={colours.grey200}
        hoverColour={colours.grey400}
      >
        Sign in
      </Button>
    </ButtonContainer>
  </Container>
);

export default SignInPage;

// TODO: We are wrapping all pages in _app.tsx with the Layout component, as every component needs the layout
// except for this page. For now we are covering it up so the user cannot see it.
// We can't use useSession in _app.js, which is why we're loading the header.
const Container = styled.div`
  background-color: ${colours.grey500};
  height: 100vh;
  width: 100vw;
  max-width: 400px;
  position: absolute;
`;

const ButtonContainer = styled.div`
  margin: 16px;
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return {
      props: {},
      redirect: {
        destination: "/leagues",
        permanent: false,
      },
    };
  }

  return { props: {} };
};
