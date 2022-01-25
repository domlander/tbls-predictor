import React from "react";
import styled from "styled-components";
import Image from "next/image";

const Loading = () => (
  <>
    <Container>
      <Image
        height="100"
        width="100"
        src="/images/spinner.gif"
        alt="loading content..."
      />
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
