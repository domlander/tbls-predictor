/*
  Warnings:

  - You are about to drop the column `league_id` on the `predictions` table. All the data in the column will be lost.
  - You are about to drop the column `home_team` on the `predictions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "predictions" DROP CONSTRAINT "predictions_league_id_fkey";

-- AlterTable
ALTER TABLE "predictions" DROP COLUMN "league_id",
DROP COLUMN "home_team",
ADD COLUMN     "away_goals" SMALLINT;
