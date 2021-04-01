import { convertUrlParamToNumber } from '@/utils';
import { GetServerSideProps } from 'next'

const RedirectURL = () => {
  return null;
}

/*
  - If the User hits this page they have gone to "/league/{their league ID}"
  - I think they will always want to go the their current weekly predictions, regardless of league
    state (not started, pre-GW, mid-GW), so we should redirect them to their current gameweek predictions.
    That means showing them their predictions if we're in a gameweek, or showing them next weeks predictions if
    we are post-GW
*/
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.leagueId) {
    return {
      redirect: {
        destination: "/leagues",
        permanent: false,
      }
    };
  }

  // Get the league ID
  const leagueId = convertUrlParamToNumber(params.leagueId)

  // TODO: If the league does not belong to the user, redirect them home

  // TODO: Currently sending them to GW 1, but we should send them to the right GW
  return {
    redirect: {
      destination: `/league/${leagueId}/week/1`,
      permanent: false,
    }
  };
}

export default RedirectURL;