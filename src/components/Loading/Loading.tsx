import React from "react";
import styled from "styled-components";
import Image from "next/image";
import spinner from "public/images/spinner.gif";

const Loading = () => (
  <>
    <Container>
      <Image src={spinner} alt="loading content..." />
    </Container>
  </>
);

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
`;

export default Loading;
