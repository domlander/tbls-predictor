import React from "react";
import { signIn } from "next-auth/client";
import styled from "styled-components";
import colours from "@/styles/colours";
import Heading from "@/components/atoms/Heading";
import Button from "@/components/atoms/Button";

const LoggedOut = () => (
  <div>
    <Heading level="h1">TBLS Predictor</Heading>
    <SignInButton
      handleClick={() => signIn}
      type="button"
      colour={colours.blackblue400}
      backgroundColour={colours.grey200}
      hoverColour={colours.grey400}
    >
      Sign in
    </SignInButton>
  </div>
);

export default LoggedOut;

const SignInButton = styled(Button)`
  width: 120px;
  margin: 16px 0 0 16px;
`;
