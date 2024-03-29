/*
   Frameworks like Next.js support hot reloading of changed files, which enables you to see changes to your
   application without restarting. However, if the framework refreshes the module responsible for exporting
   PrismaClient, this can result in additional, unwanted instances of PrismaClient in a development environment.
   As a workaround, you can store PrismaClient as a global variable in development environments only, as
   global variables are not reloaded:

   https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/instantiate-prisma-client#prevent-hot-reloading-from-creating-new-instances-of-prismaclient

   Updated 11-01-2024: latest recommendation, resolves typescript errors
   https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
 */

import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate());
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
