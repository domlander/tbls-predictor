import { authOptions } from "pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import AdminUpdatePredictions from "src/containers/AdminUpdatePredictions";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/signIn");
  }

  // TODO Replace with roles https://github.com/nextauthjs/next-auth/discussions/805
  if (session.user.email !== process.env.ADMIN_EMAIL) {
    return redirect("/");
  }

  return <AdminUpdatePredictions />;
};

export default Page;
