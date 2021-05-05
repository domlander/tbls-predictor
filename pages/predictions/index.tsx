import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import redirectInternal from "../../utils/redirects";

const RedirectURL = () => null;

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
  if (!session?.user.id) return redirectInternal("/");

  // TODO: Currently sending them to GW 1, but we should redirect them to the current gameweek
  // That means showing them their predictions if we're in a gameweek, or
  // showing them next weeks predictions if we are post-gameweek
  return redirectInternal("/predictions/1");
};

export default RedirectURL;
