"use client";

import Link from "next/link";
import styled from "styled-components";
import Heading from "src/components/Heading";
import colours from "src/styles/colours";

const AdminHome = () => (
  <section>
    <Heading level="h1" variant="secondary">
      Admin
    </Heading>
    <ul>
      <Li>
        <Link href="admin/updateResults">Update Results</Link>
      </Li>
      <Li>
        <Link href="admin/manageFixtures">Manage Fixtures</Link>
      </Li>
      <Li>
        <Link href="admin/updatePredictions">
          Add/edit predictions (in development)
        </Link>
      </Li>
    </ul>
  </section>
);

const Li = styled.li`
  font-size: 2rem;
  margin: 2rem 0;
  text-decoration: underline;
  text-underline-offset: 3px;
  padding: 0 1em;

  a {
    &:hover {
      color: ${colours.cyan300};
    }
  }
`;

export default AdminHome;
