import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

// We get the users session
export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/signIn");
  }

  return redirect(`/predictedtable/${session.user.id}`);
};

export default Page;