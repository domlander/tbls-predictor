/*
  Warnings:

  - The primary key for the `predictions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `predictions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "predictions" DROP CONSTRAINT "predictions_pkey",
DROP COLUMN "id",
ADD PRIMARY KEY ("fixture_id", "user_id");
