import { useQuery } from "@apollo/client";
import { LEAGUES_QUERY } from "apollo/queries";

const useLeagues = (userId: number | null) => {
  if (userId === null) return [null, false, false];

  const { data, loading, error } = useQuery(LEAGUES_QUERY, {
    variables: { input: { userId } },
  });

  return [
    data?.leagues?.userLeagues || [],
    data?.leagues?.publicLeagues || [],
    loading,
    error,
  ];
};

export default useLeagues;
