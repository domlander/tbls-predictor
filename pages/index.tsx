import React from "react";
import { GetServerSideProps } from "next";

import { gql, useQuery } from "@apollo/client";
import { initializeApollo } from "../apollo/client";

const myQuery = gql`
  query products {
    products {
      id
      name
    }
  }
`;

const HomePage = () => {
  const { data } = useQuery(myQuery);

  console.log({ data });

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: myQuery,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};

export default HomePage;

// import React from "react";
// import Home from "@/containers/Home";
// import { GetServerSideProps } from "next";
// import { getSession } from "next-auth/client";

// export default function HomePage() {
//   return <Home />;
// }

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await getSession(context);
//   if (!session) {
//     return {
//       props: {},
//       redirect: {
//         destination: "/signIn",
//         permanent: false,
//       },
//     };
//   }

//   return { props: {} };
// };
