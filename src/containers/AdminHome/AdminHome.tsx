import React from "react";
import Link from "next/link";
import styled from "styled-components";
import Heading from "src/components/Heading";
import colours from "src/styles/colours";

const AdminHome = () => (
  <main>
    <Heading level="h1">Admin</Heading>
    <ul>
      <Li>
        <Link href="admin/updateResults">
          <a>Update Results</a>
        </Link>
      </Li>
      <Li>
        <Link href="admin/manageFixtures">
          <a>Manage Fixtures</a>
        </Link>
      </Li>
    </ul>
  </main>
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

export default AdminHome;
