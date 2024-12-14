import { auth } from "auth";

import { redirect } from "next/navigation";

// We get the users session, so don't use caching
export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signIn");
  }

  return redirect(`/predictedtable/${session.user.id}`);
};

export default Page;
