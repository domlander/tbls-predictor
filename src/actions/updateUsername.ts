"use server";

import { auth } from "auth";

import prisma from "prisma/client";

const updateUsername = async (
  _: any,
  formData: FormData
): Promise<{ message: string }> => {
  const username = formData.get("username");

  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 20
  ) {
    return { message: "Select a username between 3 and 20 characters" };
  }

  const session = await auth();
  if (!session) {
    return { message: "An error has occured" };
  }

  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username,
      },
    });
    return { message: "Success! Username has been updated!" };
  } catch (e) {
    return { message: "Failed to update username" };
  }
};

export default updateUsername;
