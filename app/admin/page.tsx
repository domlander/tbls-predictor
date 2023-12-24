import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import AdminHome from "src/containers/AdminHome/AdminHome";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await getServerSession(authOptions);
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
