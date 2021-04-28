import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import redirectInternal from "../../utils/redirects";

const RedirectURL = () => null;

/*
  - If the User hits this page they have gone to "/predictions"
  - I think they will always want to go the their current weekly predictions, so we should redirect them to the
    current gameweek. That means showing them their predictions if we're in a gameweek, or showing them next
    weeks predictions if we are post-gameweek
*/
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

  // TODO: Currently sending them to GW 1, but we should send them to the right GW
  return redirectInternal("/predictions/1");
};

export default RedirectURL;
