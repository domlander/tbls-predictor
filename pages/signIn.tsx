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
        hoverColour={colours.grey300}
      >
        Sign in
      </Button>
    </ButtonContainer>
  </Container>
);

export default SignInPage;

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
