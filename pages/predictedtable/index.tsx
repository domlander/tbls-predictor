import { GetServerSideProps } from "next";
import redirectInternal from "utils/redirects";
import { getSession } from "next-auth/react";

const RedirectURL = () => null;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session?.user?.id) {
    return {
      props: {},
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  }

  return redirectInternal(`/predictedtable/${session.user.id}`);
};

export default RedirectURL;
