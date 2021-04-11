/*
   Frameworks like Next.js support hot reloading of changed files, which enables you to see changes to your
   application without restarting. However, if the framework refreshes the module responsible for exporting
   PrismaClient, this can result in additional, unwanted instances of PrismaClient in a development environment.
   As a workaround, you can store PrismaClient as a global variable in development environments only, as
   global variables are not reloaded:

   https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/instantiate-prisma-client#prevent-hot-reloading-from-creating-new-instances-of-prismaclient
 */

import { PrismaClient } from "@prisma/client"

declare global {
    namespace NodeJS {
        interface Global {
            prisma: PrismaClient;
        }
    }
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma