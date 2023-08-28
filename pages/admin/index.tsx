import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import AdminHome from "src/containers/AdminHome";

const AdminHomePage = () => <AdminHome />;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      props: {},
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  }

  // TODO Replace with roles https://github.com/nextauthjs/next-auth/discussions/805
  if (session.user.email !== process.env.ADMIN_EMAIL) {
    return {
      props: {},
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default AdminHomePage;
