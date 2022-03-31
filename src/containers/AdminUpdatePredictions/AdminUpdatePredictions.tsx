import React from "react";
import styled from "styled-components";
import Heading from "src/components/Heading";
import colours from "src/styles/colours";

const AdminUpdatePredictions = () => (
  <section>
    <Heading level="h1" variant="secondary">
      Update Predictions
    </Heading>
  </section>
);

const Li = styled.li`
  font-size: 2rem;
  margin: 2rem 0;

  a {
    :hover {
      color: ${colours.cyan300};
    }
  }
`;

export default AdminUpdatePredictions;
