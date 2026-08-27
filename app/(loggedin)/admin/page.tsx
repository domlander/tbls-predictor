import { auth } from "auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import AdminHome from "src/containers/AdminHome/AdminHome";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  if (!session) {
    return redirect("/signIn");
  }

  // TODO Replace with roles
  if (session.user.email !== process.env.ADMIN_EMAIL) {
    return redirect("/");
  }

  return <AdminHome />;
};

export default Page;
