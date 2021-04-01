/*
  Warnings:

  - You are about to drop the `_LeaguesToUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LeaguesToUsers" DROP CONSTRAINT "_LeaguesToUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_LeaguesToUsers" DROP CONSTRAINT "_LeaguesToUsers_B_fkey";

-- DropTable
DROP TABLE "_LeaguesToUsers";

-- CreateTable
CREATE TABLE "UsersOnLeagues" (
    "userId" INTEGER NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "status" "league_status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId","leagueId")
);

-- CreateTable
CREATE TABLE "_LeagueToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LeagueToUser_AB_unique" ON "_LeagueToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_LeagueToUser_B_index" ON "_LeagueToUser"("B");

-- AddForeignKey
ALTER TABLE "UsersOnLeagues" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnLeagues" ADD FOREIGN KEY ("leagueId") REFERENCES "leagues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeagueToUser" ADD FOREIGN KEY ("A") REFERENCES "leagues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeagueToUser" ADD FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
