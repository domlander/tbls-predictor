import { redirect } from "next/navigation";
import { auth } from "auth";

import AdminHome from "src/containers/AdminHome/AdminHome";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await auth();
  if (!session) {
    return redirect("/signIn");
  }

  // TODO Replace with roles https://github.com/nextauthjs/next-auth/discussions/805
  if (session.user.email !== process.env.ADMIN_EMAIL) {
    return redirect("/");
  }

  return <AdminHome />;
};

export default Page;
