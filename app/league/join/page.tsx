import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "pages/api/auth/[...nextauth]";
import JoinLeague from "src/containers/JoinLeague";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return redirect("/signIn");
  }

  return <JoinLeague />;
};

export default Page;
