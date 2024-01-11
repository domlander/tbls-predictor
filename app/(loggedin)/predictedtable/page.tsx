import { getServerSession } from "next-auth/next";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

// We get the users session, so don't use caching
export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/signIn");
  }

  return redirect(`/predictedtable/${session.user.id}`);
};

export default Page;
