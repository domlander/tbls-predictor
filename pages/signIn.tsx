import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import SignInContainer from "src/containers/SignIn";

const SignInPage = () => <SignInContainer />;

export default SignInPage;

// TODO: We are wrapping all pages in _app.tsx with the Layout component, as every component needs the layout
// except for this page. For now we are covering it up so the user cannot see it.
// We can't use useSession in _app.js, which is why we're loading the header.
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return {
      props: {},
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
};
