import { useState } from "react";
import { useQuery } from "@apollo/client";

import { USER_LEAGUES_QUERY } from "apollo/queries";
import UserLeague from "src/types/UserLeague";

const useUserLeagues = () => {
  const [userLeagues, setUserLeagues] = useState<UserLeague[]>([]);

  const { loading, error } = useQuery(USER_LEAGUES_QUERY, {
    onCompleted: (data) => {
      setUserLeagues(data?.user?.leagues || []);
    },
  });

  return [userLeagues, loading, error];
};

export default useUserLeagues;
